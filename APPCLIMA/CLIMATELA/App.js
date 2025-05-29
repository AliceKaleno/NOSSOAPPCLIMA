import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ActivityIndicator, StatusBar, TouchableOpacity, TextInput,
} from 'react-native';
import axios from 'axios';

export default function TelaClima() {
  const [previsao, setPrevisao] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [textoCidade, setTextoCidade] = useState('');
  const [cidadeBuscada, setCidadeBuscada] = useState('');
  const [uso24Horas, setUso24Horas] = useState(false);
//Caso expire , colocar nova chave para testar , elas não estã durando muito 
  const CHAVE_API = '92ccd2aa';

  useEffect(() => {
    if (!cidadeBuscada) return;
    setCarregando(true);
    axios
      .get(`https://api.hgbrasil.com/weather?key=${CHAVE_API}&city_name=${encodeURIComponent(cidadeBuscada)}`)
      .then(({ data }) => {
        if (data.error) {
          setPrevisao(null);
        } else {
          setPrevisao(data.results);
        }
      })
      .catch(() => {
        setPrevisao(null);
      })
      .finally(() => setCarregando(false));
  }, [cidadeBuscada]);

  const estilos = temaEscuro ? estilosEscuro : estilosClaro;

  const formatarHora = (horario) => {
    if (!uso24Horas || !horario) return horario;
    const [horaMin, sufixo] = horario.split(' ');
    let [h, m] = horaMin.split(':').map(Number);
    if (sufixo.toLowerCase() === 'pm' && h < 12) h += 12;
    if (sufixo.toLowerCase() === 'am' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const InputCidade = () => (
    <View style={estilos.tela}>
      <Text style={estilos.textoPergunta}>Digite a cidade:</Text>
      <TextInput
        style={estilos.entradaCidade}
        placeholder="Ex: Recife, PE"
        placeholderTextColor={temaEscuro ? '#CCC' : '#999'}
        value={textoCidade}
        onChangeText={setTextoCidade}
      />
      <TouchableOpacity
        style={estilos.botaoEnviar}
        onPress={() => setCidadeBuscada(textoCidade.trim())}
        disabled={!textoCidade.trim()}
      >
        <Text style={estilos.textoBotao}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );

  const Carregando = () => (
    <View style={estilos.tela}>
      <ActivityIndicator size="large" color={temaEscuro ? '#4FC3F7' : '#007AFF'} />
      <Text style={estilos.textoCarregando}>Carregando...</Text>
    </View>
  );

  const Erro = () => (
    <View style={estilos.tela}>
      <Text style={estilos.textoCarregando}>Erro ao buscar cidade.</Text>
    </View>
  );

  const BotaoTema = () => (
    <TouchableOpacity
      onPress={() => setTemaEscuro((antes) => !antes)}
      style={estilos.botaoTema}
    >
      <Text style={estilos.textoBotaoTema}>
        {temaEscuro ? '🌞 Modo Dia' : '🌙 Modo Noite'}
      </Text>
    </TouchableOpacity>
  );

  const CartaoClima = () => {
    const { city, temp, description, img_id, sunrise, sunset, wind_speedy, humidity, condition_slug } = previsao;
    const urlIcone = img_id
      ? `https://assets.hgbrasil.com/weather/images/${img_id}.png`
      : `https://assets.hgbrasil.com/weather/images/${condition_slug}.png`;

    return (
      <View style={estilos.tela}>
        <StatusBar barStyle={temaEscuro ? 'light-content' : 'dark-content'} />
        <BotaoTema />
        <View style={estilos.card}>
          <Text style={estilos.tituloCidade}>{city}</Text>
          <Image source={{ uri: urlIcone }} style={estilos.icone} />
          <Text style={estilos.tituloTemp}>{temp}°C</Text>
          <Text style={estilos.subtitulo}>{description}</Text>
          <View style={estilos.containerInfo}>
            <View style={estilos.linhaInfo}>
              <View style={estilos.boxInfo}>
                <Text style={estilos.label}>Nascer do Sol</Text>
                <Text style={estilos.valor}>{formatarHora(sunrise)}</Text>
              </View>
              <View style={estilos.boxInfo}>
                <Text style={estilos.label}>Pôr do Sol</Text>
                <Text style={estilos.valor}>{formatarHora(sunset)}</Text>
              </View>
            </View>
            <View style={estilos.linhaInfo}>
              <View style={estilos.boxInfo}>
                <Text style={estilos.label}>Vento</Text>
                <Text style={estilos.valor}>{wind_speedy}</Text>
              </View>
              <View style={estilos.boxInfo}>
                <Text style={estilos.label}>Humidade</Text>
                <Text style={estilos.valor}>{humidity}%</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={estilos.botaoInferior}
            onPress={() => setUso24Horas((antes) => !antes)}
          >
            <Text style={estilos.textoBotaoInferior}>⏰ Alterar horário</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!cidadeBuscada) return <InputCidade />;
  if (carregando) return <Carregando />;
  if (!previsao) return <Erro />;
  return <CartaoClima />;
}

const base = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
};

    const cardBase = {
  width: '100%',
  maxWidth: 360,
  borderRadius: 24,
  padding: 24,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.15,
  shadowRadius: 10,
  elevation: 8,
};

const estilosClaro = StyleSheet.create({
  tela: { ...base, backgroundColor: '#b0c4de' },
  textoPergunta: { fontSize: 20, marginBottom: 16, color: '#333', fontWeight: '600' },
  entradaCidade: {
    width: '100%', maxWidth: 300, backgroundColor: '#FFF', borderRadius: 12,
    padding: 14, fontSize: 16, marginBottom: 16, borderColor: '#007AFF', borderWidth: 1.5,
  },
  botaoEnviar: {
    backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12,
  },
  textoBotao: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  textoCarregando: { marginTop: 16, fontSize: 18, color: '#007AFF' },

  card: { ...cardBase, backgroundColor: '#faf0e6' },
  tituloCidade: { fontSize: 28, fontWeight: '700', color: '#007AFF', marginBottom: 12 },
  icone: { width: 120, height: 120, marginVertical: 12 },
  tituloTemp: { fontSize: 52, fontWeight: '800', color: '#007AFF', marginVertical: 6 },
     subtitulo: { fontSize: 18, fontStyle: 'italic', color: '#555', marginBottom: 16 },
    containerInfo: { width: '100%' },
  linhaInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  boxInfo: { alignItems: 'center', flex: 1 },
  label: { fontSize: 14, color: '#777' },
        valor: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 4 },
  botaoTema: {
    position: 'absolute', top: 50, right: 20, paddingVertical: 8, paddingHorizontal: 16,
    backgroundColor: '#ffffffcc', borderRadius: 20,
  },
  textoBotaoTema: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
  botaoInferior: {
    marginTop: 24, backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 28,
    borderRadius: 12,
  },
  textoBotaoInferior: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

const estilosEscuro = StyleSheet.create({
  ...estilosClaro,
  tela: { ...base, backgroundColor: '#0e0e2c' },
  textoPergunta: { ...estilosClaro.textoPergunta, color: '#FFF' },
  entradaCidade: { ...estilosClaro.entradaCidade, backgroundColor: '#1A1A1A', color: '#FFF', borderColor: '#4FC3F7' },
  botaoEnviar: { ...estilosClaro.botaoEnviar, backgroundColor: '#4FC3F7' },
  textoBotao: { ...estilosClaro.textoBotao, color: '#000' },
  textoCarregando: { ...estilosClaro.textoCarregando, color: '#4FC3F7' },
  card: { ...cardBase, backgroundColor: '#1C1C3A' },
  tituloCidade: { ...estilosClaro.tituloCidade, color: '#4FC3F7' },
  tituloTemp: { ...estilosClaro.tituloTemp, color: '#4FC3F7' },
  subtitulo: { ...estilosClaro.subtitulo, color: '#CCC' },
  label: { ...estilosClaro.label, color: '#AAA' },
  valor: { ...estilosClaro.valor, color: '#FFF' },
  botaoTema: { backgroundColor: '#333' },
  textoBotaoTema: { ...estilosClaro.textoBotaoTema, color: '#FFF' },
  botaoInferior: { ...estilosClaro.botaoInferior, backgroundColor: '#4FC3F7' },
  textoBotaoInferior: { ...estilosClaro.textoBotaoInferior, color: '#000' },
});
