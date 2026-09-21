function youtubeSearch(subject, topic) {
  const query = encodeURIComponent(`${subject} ${topic} 9 ano`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

export const DEFAULT_TASKS = [
  { week: "s1", day: "Segunda-feira", subject: "Português", tag: "port", topic: "Interpretação de texto: ideia principal, inferência e vocabulário no contexto" },
  { week: "s1", day: "Terça-feira", subject: "Matemática", tag: "mat", topic: "Números reais: naturais, inteiros, racionais e irracionais" },
  { week: "s1", day: "Quarta-feira", subject: "Português", tag: "port", topic: "Gêneros textuais: notícia, tirinha, anúncio e artigo de opinião" },
  { week: "s1", day: "Quinta-feira", subject: "Matemática", tag: "mat", topic: "Potenciação e radiciação; raiz quadrada e cúbica" },
  { week: "s1", day: "Sexta-feira", subject: "Revisão", tag: "rev", topic: "Revisar a semana + 10 exercícios de interpretação + 10 de matemática" },

  { week: "s2", day: "Segunda-feira", subject: "Português", tag: "port", topic: "Classes de palavras: substantivo, adjetivo, verbo, advérbio e pronome" },
  { week: "s2", day: "Terça-feira", subject: "Matemática", tag: "mat", topic: "Equações do 1º grau e expressões algébricas" },
  { week: "s2", day: "Quarta-feira", subject: "Português", tag: "port", topic: "Figuras de linguagem: metáfora, comparação, hipérbole e ironia" },
  { week: "s2", day: "Quinta-feira", subject: "Matemática", tag: "mat", topic: "Sistemas de equações e substituição (básico)" },
  { week: "s2", day: "Sexta-feira", subject: "Revisão", tag: "rev", topic: "Revisar e montar um resumo com os pontos mais difíceis da semana" },

  { week: "s3", day: "Segunda-feira", subject: "Ciências", tag: "cie", topic: "Matéria, átomo e tabela periódica (elementos básicos)" },
  { week: "s3", day: "Terça-feira", subject: "Geografia", tag: "geo", topic: "Globalização: o que é, vantagens e desvantagens" },
  { week: "s3", day: "Quarta-feira", subject: "Ciências", tag: "cie", topic: "Ligações químicas e ácidos, bases, sais e óxidos (noções)" },
  { week: "s3", day: "Quinta-feira", subject: "Geografia", tag: "geo", topic: "Blocos econômicos: Mercosul, União Europeia e Nafta" },
  { week: "s3", day: "Sexta-feira", subject: "Revisão", tag: "rev", topic: "Revisar conceitos-chave da semana com mapas mentais simples" },

  { week: "s4", day: "Segunda-feira", subject: "História", tag: "hist", topic: "Era Napoleônica e Revolução Industrial" },
  { week: "s4", day: "Terça-feira", subject: "Inglês", tag: "ing", topic: "Present simple, past simple e vocabulário do cotidiano" },
  { week: "s4", day: "Quarta-feira", subject: "História", tag: "hist", topic: "Imperialismo, 1ª Guerra Mundial e crise de 1929" },
  { week: "s4", day: "Quinta-feira", subject: "Inglês", tag: "ing", topic: "Leitura e interpretação de pequenos textos em inglês" },
  { week: "s4", day: "Sexta-feira", subject: "Revisão", tag: "rev", topic: "Revisão geral do 1º mês: simuladinho com 20 questões das 4 semanas" },

  { week: "s5", day: "Segunda-feira", subject: "Matemática", tag: "mat", topic: "Função do 1º grau: lei de formação e gráfico" },
  { week: "s5", day: "Terça-feira", subject: "Português", tag: "port", topic: "Orações coordenadas e subordinadas; período composto" },
  { week: "s5", day: "Quarta-feira", subject: "Matemática", tag: "mat", topic: "Função do 2º grau (básico): raízes e vértice" },
  { week: "s5", day: "Quinta-feira", subject: "Português", tag: "port", topic: "Concordância verbal e nominal; crase e regência simples" },
  { week: "s5", day: "Sexta-feira", subject: "Revisão", tag: "rev", topic: "Exercícios mistos de funções e gramática (15 questões)" },

  { week: "s6", day: "Segunda-feira", subject: "Ciências", tag: "cie", topic: "Movimento, velocidade e aceleração (cálculos básicos)" },
  { week: "s6", day: "Terça-feira", subject: "Geografia", tag: "geo", topic: "Europa: relevo, clima, indústria e União Europeia" },
  { week: "s6", day: "Quarta-feira", subject: "Ciências", tag: "cie", topic: "Forças e Leis de Newton; peso e massa" },
  { week: "s6", day: "Quinta-feira", subject: "Geografia", tag: "geo", topic: "Ásia, Oceania e Antártida; geopolítica e conflitos atuais" },
  { week: "s6", day: "Sexta-feira", subject: "Revisão", tag: "rev", topic: "Revisar com perguntas e respostas em voz alta (estudo ativo)" },

  { week: "s7", day: "Segunda-feira", subject: "Ciências", tag: "cie", topic: "Energia, fontes renováveis e não renováveis" },
  { week: "s7", day: "Terça-feira", subject: "História", tag: "hist", topic: "Era Vargas e a industrialização do Brasil" },
  { week: "s7", day: "Quarta-feira", subject: "Ciências", tag: "cie", topic: "Genética básica: DNA, hereditariedade e herança de características" },
  { week: "s7", day: "Quinta-feira", subject: "História", tag: "hist", topic: "Ditadura Militar, redemocratização e Nova República" },
  { week: "s7", day: "Sexta-feira", subject: "Revisão", tag: "rev", topic: "Revisar com flashcards dos assuntos mais difíceis do mês" },

  { week: "s8", day: "Segunda-feira", subject: "Revisão", tag: "rev", topic: "Revisar Português e Matemática (resumos + exercícios errados)" },
  { week: "s8", day: "Terça-feira", subject: "Revisão", tag: "rev", topic: "Revisar Ciências e Geografia (mapas mentais e resumos)" },
  { week: "s8", day: "Quarta-feira", subject: "Revisão", tag: "rev", topic: "Revisar História e Inglês (linha do tempo + textos)" },
  { week: "s8", day: "Quinta-feira", subject: "Simulado", tag: "rev", topic: "Simulado 1: prova completa (português e matemática) com tempo" },
  { week: "s8", day: "Sexta-feira", subject: "Simulado", tag: "rev", topic: "Simulado 2: prova completa (ciências, geografia, história, inglês) + corrigir erros" }
].map((task) => ({
  ...task,
  video_url: youtubeSearch(task.subject, task.topic)
}));