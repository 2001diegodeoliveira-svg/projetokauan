// Banco de questões das provas semanais (15 questões por semana, 5 alternativas, 1 correta).
// Cada questão: { q: enunciado, o: [opção], c: índice da correta (0-4), e: explicação curta }

export const PROVA_QUESTIONS = {
  s1: [
    {
      q: "Ao ler um texto, a ideia principal é:",
      o: ["a primeira frase escrita pelo autor", "a informação central que o texto desenvolve", "qualquer detalhe citado no primeiro parágrafo", "a opinião de quem está lendo", "sempre o título do texto"],
      c: 1,
      e: "A ideia principal é o núcleo de informação que o texto desenvolve ao longo de toda a leitura."
    },
    {
      q: "Na frase “O céu ficou escuro e as pessoas correram para casa”, é possível inferir que:",
      o: ["estava nevando", "ia chover", "era de madrugada", "as pessoas fugiam de ladrões", "o texto fala de uma festa"],
      c: 1,
      e: "O céu escuro e a corrida para casa permitem deduzir (inferir) que se aproximava uma chuva."
    },
    {
      q: "Em “O aluno ficou atônito com a nota”, a palavra “atônito” significa:",
      o: ["triste", "envergonhado", "surpreso e espantado", "irritado", "orgulhoso"],
      c: 2,
      e: "“Atônito” é sinônimo de surpreso, espantado, sem reação diante do ocorrido."
    },
    {
      q: "O texto que relata fatos recentes e de interesse público, com estrutura de lead, é a:",
      o: ["tirinha", "receita", "notícia", "poesia", "fábula"],
      c: 2,
      e: "A notícia é o gênero jornalístico que apresenta fatos atuais e relevantes de forma objetiva."
    },
    {
      q: "O artigo de opinião tem como principal objetivo:",
      o: ["informar apenas dados científicos", "convencer o leitor sobre um ponto de vista", "contar uma história fictícia", "dar instruções de uso", "somente divertir o leitor"],
      c: 1,
      e: "O artigo de opinião defende uma tese e busca convencer o leitor por meio de argumentos."
    },
    {
      q: "A tirinha normalmente combina:",
      o: ["imagem e texto curto, com humor ou crítica", "somente texto longo", "tabelas e gráficos", "apenas imagens sem sentido", "notícias jornalísticas extensas"],
      c: 0,
      e: "As tirinhas usam poucos quadros, imagem e falas curtas para gerar humor ou crítica."
    },
    {
      q: "Qual dos números abaixo é irracional?",
      o: ["1/2", "0,333...", "√2", "4", "−7"],
      c: 2,
      e: "√2 não pode ser escrito como fração exata, por isso é irracional."
    },
    {
      q: "O número 0,5 pertence ao conjunto dos números:",
      o: ["naturais", "inteiros", "racionais", "irracionais", "imaginários"],
      c: 2,
      e: "0,5 pode ser escrito como fração (1/2), então é um número racional."
    },
    {
      q: "O valor de 2³ × 2² é:",
      o: ["12", "32", "64", "10", "16"],
      c: 1,
      e: "2³ = 8 e 2² = 4; 8 × 4 = 32."
    },
    {
      q: "O valor de 10⁻² é:",
      o: ["−20", "100", "0,01", "0,2", "−100"],
      c: 2,
      e: "Expoente negativo inverte a base: 10⁻² = 1/100 = 0,01."
    },
    {
      q: "√81 é igual a:",
      o: ["9", "81", "3", "40,5", "18"],
      c: 0,
      e: "9 × 9 = 81, portanto √81 = 9."
    },
    {
      q: "∛8 é igual a:",
      o: ["2", "4", "8", "24", "64"],
      c: 0,
      e: "2 × 2 × 2 = 8, portanto a raiz cúbica de 8 é 2."
    },
    {
      q: "√(25/100) equivale a:",
      o: ["0,5", "0,25", "2,5", "15", "0,05"],
      c: 0,
      e: "√25 = 5 e √100 = 10; 5/10 = 0,5."
    },
    {
      q: "Qual é o menor número natural?",
      o: ["−1", "0", "1", "0,5", "não existe"],
      c: 1,
      e: "O conjunto dos naturais começa em zero (dependendo da definição adotada)."
    },
    {
      q: "Em “Ele mora no litoral”, a palavra “litoral” indica:",
      o: ["uma cidade do interior", "a faixa de terra próxima ao mar", "uma montanha", "o centro de um país", "um deserto"],
      c: 1,
      e: "Litoral é a faixa de terra banhada pelo mar."
    }
  ],

  s2: [
    {
      q: "Em “A coragem do menino emocionou a todos”, a palavra “coragem” é:",
      o: ["substantivo abstrato", "substantivo concreto", "adjetivo", "verbo", "advérbio"],
      c: 0,
      e: "“Coragem” é um substantivo abstrato, pois nomeia uma qualidade que não se vê ou toca."
    },
    {
      q: "Na frase “O dia ensolarado alegrou a turma”, a palavra “ensolarado” é:",
      o: ["verbo", "advérbio", "substantivo", "adjetivo", "pronome"],
      c: 3,
      e: "“Ensolarado” caracteriza o substantivo “dia”, função típica do adjetivo."
    },
    {
      q: "Em “Cantaremos amanhã”, o verbo indica tempo:",
      o: ["passado", "presente", "futuro", "imperativo", "infinitivo"],
      c: 2,
      e: "“Cantaremos” está no futuro do presente do indicativo."
    },
    {
      q: "Na frase “Ele chegou rapidamente”, a palavra “rapidamente” é:",
      o: ["advérbio", "adjetivo", "conjunção", "pronome", "preposição"],
      c: 0,
      e: "“Rapidamente” indica o modo como ele chegou, funcionando como advérbio."
    },
    {
      q: "Em “Eu trouxe o livro para você”, as palavras “eu” e “você” são:",
      o: ["conjunções", "pronomes", "adjetivos", "numerais", "interjeições"],
      c: 1,
      e: "“Eu” e “você” são pronomes pessoais."
    },
    {
      q: "Na frase “Seus olhos eram duas jabuticabas”, a figura de linguagem é:",
      o: ["comparação", "hipérbole", "ironia", "metáfora", "onomatopeia"],
      c: 3,
      e: "Há metáfora porque os olhos são comparados às jabuticabas sem o conectivo comparativo."
    },
    {
      q: "Na frase “Seus olhos eram como jabuticabas”, a figura de linguagem é:",
      o: ["comparação", "metáfora", "hipérbole", "ironia", "personificação"],
      c: 0,
      e: "O conectivo “como” caracteriza a comparação (símile)."
    },
    {
      q: "“Estou morrendo de fome” é um exemplo de:",
      o: ["hipérbole", "ironia", "comparação", "metonímia", "paradoxo"],
      c: 0,
      e: "A hipérbole exagera a ideia: não se está literalmente morrendo."
    },
    {
      q: "“Que dia maravilhoso para ficar preso no trânsito!” é um exemplo de:",
      o: ["hipérbole", "ironia", "comparação", "metáfora", "eufemismo"],
      c: 1,
      e: "A fala diz o contrário do que se pensa, característica da ironia."
    },
    {
      q: "Resolva a equação: x + 7 = 12. O valor de x é:",
      o: ["5", "19", "3", "7", "−5"],
      c: 0,
      e: "x = 12 − 7 = 5."
    },
    {
      q: "Resolva a equação: 3x = 21. O valor de x é:",
      o: ["7", "18", "24", "3", "63"],
      c: 0,
      e: "x = 21/3 = 7."
    },
    {
      q: "Se x = 2, o valor da expressão algébrica 3x + 5 é:",
      o: ["11", "10", "16", "13", "8"],
      c: 0,
      e: "3 × 2 + 5 = 6 + 5 = 11."
    },
    {
      q: "Resolva a equação: 2x − 4 = 10. O valor de x é:",
      o: ["7", "3", "14", "6", "−3"],
      c: 0,
      e: "2x = 14, então x = 7."
    },
    {
      q: "No sistema {x + y = 5; x − y = 1}, o valor de x é:",
      o: ["3", "2", "4", "1", "5"],
      c: 0,
      e: "Somando as equações: 2x = 6, logo x = 3."
    },
    {
      q: "No sistema {x + y = 5; x − y = 1}, o valor de y é:",
      o: ["1", "2", "3", "4", "5"],
      c: 1,
      e: "Como x = 3, temos 3 + y = 5, então y = 2."
    }
  ],

  s3: [
    {
      q: "Tudo o que ocupa lugar no espaço e possui massa é chamado de:",
      o: ["energia", "matéria", "átomo", "molécula", "vácuo"],
      c: 1,
      e: "Matéria é tudo aquilo que tem massa e ocupa lugar no espaço."
    },
    {
      q: "A partícula do átomo com carga negativa é o:",
      o: ["próton", "nêutron", "elétron", "núcleo", "íon"],
      c: 2,
      e: "O elétron possui carga negativa; o próton, positiva; o nêutron, neutra."
    },
    {
      q: "O elemento químico é identificado principalmente pelo número de:",
      o: ["prótons", "elétrons livres", "nêutrons extras", "camadas", "ligações"],
      c: 0,
      e: "O número atômico (quantidade de prótons) define qual é o elemento."
    },
    {
      q: "Na tabela periódica, os elementos estão organizados em ordem crescente de:",
      o: ["volume", "número atômico", "densidade", "temperatura", "símbolo"],
      c: 1,
      e: "A organização segue o número atômico (quantidade de prótons)."
    },
    {
      q: "A ligação entre um metal e um não metal, com transferência de elétrons, é chamada de:",
      o: ["iônica", "covalente", "metálica", "dipolo", "de hidrogênio"],
      c: 0,
      e: "Na ligação iônica o metal doa elétrons e o não metal recebe, formando íons."
    },
    {
      q: "Na ligação covalente, os átomos:",
      o: ["transferem elétrons", "compartilham elétrons", "perdem prótons", "criam sempre íons", "não interagem"],
      c: 1,
      e: "Na covalente os elétrons são compartilhados entre os átomos."
    },
    {
      q: "O suco de limão, com pH baixo, é um exemplo de:",
      o: ["base", "ácido", "sal", "óxido", "metal"],
      c: 1,
      e: "O limão contém ácido cítrico, que confere pH baixo e sabor azedo."
    },
    {
      q: "A substância que libera íons OH⁻ em água e tem caráter adstringente é:",
      o: ["ácido", "base", "sal", "óxido", "elemento"],
      c: 1,
      e: "Bases liberam hidroxilas (OH⁻) em solução aquosa."
    },
    {
      q: "O cloreto de sódio (sal de cozinha) é produto típico da reação entre:",
      o: ["ácido e base", "dois metais", "dois gases nobres", "somente água", "óxido e metal"],
      c: 0,
      e: "Na neutralização entre um ácido e uma base formam-se sal e água."
    },
    {
      q: "A globalização é o processo que intensifica:",
      o: ["o isolamento dos países", "a integração econômica e cultural entre países", "a proibição do comércio externo", "a redução do uso da internet", "o fim das fronteiras linguísticas"],
      c: 1,
      e: "A globalização aproxima países por meio de comércio, tecnologia e cultura."
    },
    {
      q: "Uma característica marcante da globalização atual é:",
      o: ["o comércio apenas local", "o aumento das transações e conexões em escala mundial", "o fim das empresas multinacionais", "a redução das telecomunicações", "a autossuficiência total dos países"],
      c: 1,
      e: "O mundo está cada vez mais conectado em redes de comércio, informação e produção."
    },
    {
      q: "O Mercosul reúne principalmente países de qual região?",
      o: ["América do Sul", "Europa", "Ásia", "África", "Oceania"],
      c: 0,
      e: "O Mercosul é um bloco econômico sul-americano."
    },
    {
      q: "A União Europeia é conhecida por:",
      o: ["reunir países da América Latina", "integrar países europeus com mercado comum e moeda em vários membros", "ser um tratado exclusivo de defesa da África", "agrupar apenas países asiáticos", "unificar todo o continente americano"],
      c: 1,
      e: "A UE integra países europeus, com livre circulação e o euro em muitos membros."
    },
    {
      q: "O Nafta (atual TMEC/USMCA) foi um acordo econômico entre:",
      o: ["México, EUA e Canadá", "Brasil, Argentina e Chile", "China, Japão e Coreia", "Alemanha, França e Itália", "Egito, Líbia e Argélia"],
      c: 0,
      e: "O acordo reúne os três países da América do Norte."
    },
    {
      q: "A tecnologia da informação impulsiona a globalização ao:",
      o: ["impedir a circulação de dados", "conectar pessoas e mercados em tempo real", "aumentar as distâncias", "eliminar o uso da internet", "limitar o comércio"],
      c: 1,
      e: "A internet e as telecomunicações conectam mercados e pessoas instantaneamente."
    }
  ],

  s4: [
    {
      q: "Napoleão Bonaparte ascendeu ao poder na França após:",
      o: ["a Guerra Fria", "a Revolução Francesa", "a queda de Roma", "a 2ª Guerra Mundial", "o período feudal"],
      c: 1,
      e: "Napoleão ganhou destaque no período pós-Revolução Francesa e chegou ao poder em 1799."
    },
    {
      q: "O Código Napoleônico:",
      o: ["reuniu as leis civis francesas", "foi um novo imposto", "criou a monarquia", "proibiu as escolas", "iniciou a revolução agrícola"],
      c: 0,
      e: "O Código Napoleônico organizou as leis civis da França e influenciou vários países."
    },
    {
      q: "A Revolução Industrial teve início na:",
      o: ["França", "Inglaterra", "Brasil", "Alemanha", "Japão"],
      c: 1,
      e: "A Inglaterra do século XVIII é considerada o berço da Revolução Industrial."
    },
    {
      q: "A máquina a vapor, símbolo da 1ª Revolução Industrial, era movida principalmente a:",
      o: ["eletricidade", "carvão", "petróleo", "vento", "energia solar"],
      c: 1,
      e: "O carvão mineral alimentava as máquinas a vapor das primeiras fábricas."
    },
    {
      q: "A Revolução Industrial transformou a produção ao:",
      o: ["substituir o artesanato pela produção fabril em escala", "manter tudo no campo", "acabar com as fábricas", "proibir o comércio", "reduzir o uso de máquinas"],
      c: 0,
      e: "As fábricas passaram a produzir em grande quantidade, reduzindo o artesanato."
    },
    {
      q: "O imperialismo europeu no século XIX:",
      o: ["promoveu a partilha da África e da Ásia entre potências", "unificou a África", "foi um movimento religioso", "acabou com o colonialismo", "foi exclusivo das Américas"],
      c: 0,
      e: "As potências europeias dividiram e dominaram territórios na África e na Ásia."
    },
    {
      q: "A 1ª Guerra Mundial (1914–1918) ficou marcada pela:",
      o: ["guerra de trincheiras", "utilização de bombas atômicas", "ausência de conflitos", "disputa apenas marítima de piratas", "paz imediata"],
      c: 0,
      e: "As trincheiras foram a imagem mais conhecida do conflito na Frente Ocidental."
    },
    {
      q: "A Crise de 1929 começou com:",
      o: ["a quebra da bolsa de valores de Nova York", "a Revolução Industrial", "a queda do Império Romano", "a 2ª Guerra Mundial", "a independência dos EUA"],
      c: 0,
      e: "A quebra da Bolsa de Nova York em outubro de 1929 iniciou a Grande Depressão."
    },
    {
      q: "A Crise de 1929 gerou:",
      o: ["prosperidade mundial", "desemprego e recessão nos EUA e no mundo", "a união entre URSS e EUA", "o fim do capitalismo", "crescimento agrícola chinês"],
      c: 1,
      e: "A depressão derrubou a produção e o emprego em vários países."
    },
    {
      q: "Complete: “She ___ to school every day.”",
      o: ["go", "goes", "going", "gone", "went"],
      c: 1,
      e: "No present simple, com she/he/it, o verbo recebe “-s”/“-es”: goes."
    },
    {
      q: "Complete: “Yesterday, they ___ to the park.”",
      o: ["go", "goes", "went", "going", "gone"],
      c: 2,
      e: "“Yesterday” indica passado; “went” é o passado de “go”."
    },
    {
      q: "A palavra inglesa “mother” significa em português:",
      o: ["mãe", "irmã", "avó", "tia", "filha"],
      c: 0,
      e: "“Mother” = mãe."
    },
    {
      q: "Traduza: “He is hungry because he didn't eat breakfast.” Ele:",
      o: ["tem fome porque não tomou café da manhã", "comeu demais", "está com sono", "tomou café com amigos", "foi ao médico"],
      c: 0,
      e: "“Hungry” = com fome; “didn't eat breakfast” = não comeu o café da manhã."
    },
    {
      q: "Complete: “They don't ___ coffee in the morning.”",
      o: ["drink", "drinks", "drinking", "drank", "drunk"],
      c: 0,
      e: "Após “don't”, o verbo fica na forma base: drink."
    },
    {
      q: "A palavra inglesa “book” significa em português:",
      o: ["caneta", "livro", "caderno", "mesa", "mochila"],
      c: 1,
      e: "“Book” = livro."
    }
  ],

  s5: [
    {
      q: "Na função f(x) = 2x + 3, o coeficiente angular é:",
      o: ["2", "3", "x", "1", "5"],
      c: 0,
      e: "Na forma f(x) = ax + b, “a” (2) é o coeficiente angular."
    },
    {
      q: "Na função f(x) = 2x + 3, o termo independente é:",
      o: ["2", "3", "x", "0", "1"],
      c: 1,
      e: "Na forma f(x) = ax + b, “b” (3) é o termo independente."
    },
    {
      q: "Dada f(x) = 2x + 3, o valor de f(1) é:",
      o: ["5", "4", "6", "3", "2"],
      c: 0,
      e: "f(1) = 2 × 1 + 3 = 5."
    },
    {
      q: "A raiz (zero) da função f(x) = 2x + 6 é:",
      o: ["−3", "3", "−6", "6", "0"],
      c: 0,
      e: "2x + 6 = 0 ⇒ x = −3."
    },
    {
      q: "O gráfico de uma função do 1º grau é sempre:",
      o: ["uma reta", "uma parábola", "um círculo", "um ponto", "uma hipérbole"],
      c: 0,
      e: "A função do 1º grau tem gráfico em forma de reta."
    },
    {
      q: "O gráfico de uma função do 2º grau é:",
      o: ["uma reta", "uma parábola", "um círculo", "um triângulo", "um segmento"],
      c: 1,
      e: "A função do 2º grau tem gráfico em formato de parábola."
    },
    {
      q: "As raízes da função f(x) = x² − 5x + 6 são:",
      o: ["2 e 3", "1 e 6", "−2 e −3", "5 e 6", "0 e 6"],
      c: 0,
      e: "x² − 5x + 6 = (x − 2)(x − 3) = 0 ⇒ x = 2 ou x = 3."
    },
    {
      q: "As raízes da função f(x) = x² − 4 são:",
      o: ["2 e −2", "4 e −4", "1 e −1", "0 e 4", "2 e 4"],
      c: 0,
      e: "x² − 4 = 0 ⇒ x² = 4 ⇒ x = ±2."
    },
    {
      q: "O vértice da parábola representa o:",
      o: ["ponto de máximo ou mínimo da função", "maior valor de x", "corte no eixo y", "zero da função", "ponto simétrico do foco"],
      c: 0,
      e: "O vértice é o ponto de máximo (concavidade para baixo) ou mínimo (para cima)."
    },
    {
      q: "Em “Estudei muito, mas não passei”, a oração introduzida por “mas” expressa:",
      o: ["oposição (adversativa)", "causa", "tempo", "condição", "finalidade"],
      c: 0,
      e: "“Mas” é conjunção adversativa, indicando oposição entre as ideias."
    },
    {
      q: "Em “Quando cheguei, todos já tinham saído”, a oração “Quando cheguei” é:",
      o: ["subordinada adverbial temporal", "coordenada adversativa", "subordinada substantiva", "oração principal", "reduzida de infinitivo"],
      c: 0,
      e: "A oração indica tempo e depende da principal: é subordinada adverbial temporal."
    },
    {
      q: "Um período composto por coordenação:",
      o: ["tem orações independentes entre si", "tem uma oração principal da qual as outras dependem", "não tem verbo", "tem apenas uma oração", "só existe na poesia"],
      c: 0,
      e: "Na coordenação, as orações são sintaticamente independentes."
    },
    {
      q: "Assinale a frase com concordância verbal correta:",
      o: ["Fazem dois anos que estudo aqui.", "Faz dois anos que estudo aqui.", "Fazem seis anos que morei lá.", "Faziam dez anos que ele saiu.", "Fazem muito tempo que esperamos."],
      c: 1,
      e: "“Fazer” indicando tempo decorrido é impessoal e fica no singular: “Faz dois anos”."
    },
    {
      q: "Assinale a frase com concordância nominal correta:",
      o: ["As meninas estavam feliz com a notícia.", "As meninas estavam felizes com a notícia.", "As meninas estavam contente.", "As meninas estava felizes.", "As meninas estavam satisfeito."],
      c: 1,
      e: "O adjetivo concorda com o substantivo no plural: “felizes”."
    },
    {
      q: "Indique a frase em que o uso da crase está correto:",
      o: ["Entreguei o presente a ele.", "Vou à escola amanhã.", "Refiro-me a você.", "Saí a pé.", "Assisti a filme ontem."],
      c: 1,
      e: "“Vou à escola” = verbo ir + a + artigo a (escola), por isso há crase."
    }
  ],

  s6: [
    {
      q: "A velocidade média é calculada por:",
      o: ["distância × tempo", "distância ÷ tempo", "tempo ÷ distância", "massa × aceleração", "força ÷ massa"],
      c: 1,
      e: "Velocidade média = distância percorrida dividida pelo tempo gasto."
    },
    {
      q: "Um carro percorre 120 km em 2 horas. Sua velocidade média é:",
      o: ["60 km/h", "120 km/h", "240 km/h", "30 km/h", "90 km/h"],
      c: 0,
      e: "vm = 120 ÷ 2 = 60 km/h."
    },
    {
      q: "A aceleração é a grandeza que mede:",
      o: ["a variação da velocidade no tempo", "a distância percorrida", "o peso do corpo", "a massa do corpo", "o volume do corpo"],
      c: 0,
      e: "Aceleração é a taxa de variação da velocidade em relação ao tempo."
    },
    {
      q: "Um carro parte do repouso e atinge 20 m/s em 4 s. Sua aceleração média é:",
      o: ["2 m/s²", "5 m/s²", "20 m/s²", "80 m/s²", "4 m/s²"],
      c: 1,
      e: "a = Δv/Δt = 20/4 = 5 m/s²."
    },
    {
      q: "Força pode ser definida como:",
      o: ["uma interação capaz de mudar o movimento dos corpos", "a massa de um corpo", "a distância percorrida", "o volume do corpo", "o tempo de queda"],
      c: 0,
      e: "Forças causam variação no estado de movimento (aceleração ou deformação)."
    },
    {
      q: "Segundo a 1ª Lei de Newton (inércia), um corpo:",
      o: ["permanece em repouso ou em movimento retilíneo uniforme, a menos que uma força atue", "sempre aumenta a velocidade", "para imediatamente quando a força cessa", "só se move quando há atrito", "nunca muda de direção"],
      c: 0,
      e: "A inércia mantém o estado de repouso ou movimento uniforme sem ação de forças."
    },
    {
      q: "A 2ª Lei de Newton relaciona força, massa e aceleração por:",
      o: ["F = m × a", "F = m × v", "F = a ÷ m", "m = F × P", "a = F × v"],
      c: 0,
      e: "A 2ª Lei diz que força resultante = massa × aceleração."
    },
    {
      q: "A 3ª Lei de Newton (ação e reação) afirma que:",
      o: ["as forças atuam sempre em pares com direções opostas", "existe apenas ação, sem reação", "a reação é sempre maior que a ação", "não há forças em repouso", "a ação atua sempre no mesmo corpo"],
      c: 0,
      e: "A toda ação corresponde uma reação de mesma intensidade e direção, em sentido oposto."
    },
    {
      q: "Sobre massa e peso, é correto afirmar que:",
      o: ["a massa não muda e o peso muda conforme a gravidade", "massa e peso são a mesma coisa", "o peso não muda e a massa muda", "ambos desaparecem no vácuo", "o peso independe da gravidade"],
      c: 0,
      e: "A massa é uma propriedade do corpo; o peso depende da gravidade local."
    },
    {
      q: "Na Lua, um astronauta:",
      o: ["pesa menos, mas mantém a mesma massa", "perde massa", "pesa mais", "ganha massa", "fica sem massa"],
      c: 0,
      e: "A gravidade lunar é menor, então o peso diminui; a massa continua igual."
    },
    {
      q: "A corrente marítima que ajuda a aquecer parte da Europa Ocidental é a:",
      o: ["Corrente do Golfo", "corrente de Humboldt", "corrente do Brasil", "corrente de Benguela", "corrente do Japão"],
      c: 0,
      e: "A Corrente do Golfo leva águas quentes para o Atlântico Norte, amenizando o clima europeu."
    },
    {
      q: "Entre os pilares da União Europeia está:",
      o: ["o mercado comum e a livre circulação de pessoas e mercadorias", "a criação de barreiras comerciais entre os membros", "apenas acordos militares", "a exclusão do comércio", "a proibição da circulação de pessoas"],
      c: 0,
      e: "A UE garante livre circulação de bens, serviços, capitais e pessoas entre os membros."
    },
    {
      q: "A Ásia é o continente:",
      o: ["mais populoso do mundo", "de menor população do mundo", "sem indústrias", "exclusivamente rural", "coberto inteiramente por gelo"],
      c: 0,
      e: "A Ásia concentra os países mais populosos, como China e Índia."
    },
    {
      q: "A Oceania é formada principalmente por:",
      o: ["ilhas e a Austrália", "apenas a Austrália", "países da Europa", "montanhas da África", "desertos da Ásia"],
      c: 0,
      e: "A Oceania reúne a Austrália e milhares de ilhas do Pacífico."
    },
    {
      q: "Sobre a Antártida, é correto afirmar que:",
      o: ["é um continente coberto de gelo, sem população fixa", "é uma ilha do oceano Pacífico", "abriga grandes cidades", "tem agricultura extensiva", "pertence a um único país"],
      c: 0,
      e: "A Antártida é um continente gelado, sem população nativa ou país dono."
    }
  ],

  s7: [
    {
      q: "Energia pode ser definida como a capacidade de:",
      o: ["realizar trabalho", "criar matéria", "parar o movimento", "reduzir a temperatura", "aumentar a massa"],
      c: 0,
      e: "Energia é a capacidade de provocar transformações ou realizar trabalho."
    },
    {
      q: "São fontes renováveis de energia:",
      o: ["solar, eólica e hidrelétrica", "carvão e petróleo", "gás natural e urânio", "petróleo e solar", "carvão e gás"],
      c: 0,
      e: "Fontes renováveis se regeneram na natureza, como sol, vento e água."
    },
    {
      q: "Qual das fontes abaixo é considerada NÃO renovável?",
      o: ["sol", "vento", "petróleo", "marés", "biomassa"],
      c: 2,
      e: "O petróleo é um combustível fóssil limitado, portanto não renovável."
    },
    {
      q: "A energia solar é obtida a partir:",
      o: ["da luz do Sol", "do carvão", "do gás natural", "da água parada", "do movimento da Terra"],
      c: 0,
      e: "Painéis solares convertem a luz do Sol em eletricidade."
    },
    {
      q: "A molécula que carrega a informação genética hereditária é o:",
      o: ["DNA", "glicose", "proteína", "óleo", "sais minerais"],
      c: 0,
      e: "O DNA contém os genes que transmitem características hereditárias."
    },
    {
      q: "A unidade básica da hereditariedade é o:",
      o: ["gene", "órgão", "tecido", "ossos", "proteína"],
      c: 0,
      e: "Os genes são as unidades que determinam as características herdadas."
    },
    {
      q: "Os cromossomos estão localizados no:",
      o: ["núcleo da célula", "citoplasma", "membrana celular", "parede celular", "espaço externo da célula"],
      c: 0,
      e: "O material genético (cromossomos) fica no núcleo das células eucariontes."
    },
    {
      q: "As características hereditárias são transmitidas:",
      o: ["pelos genes vindos dos pais", "apenas pelo ambiente", "somente pela alimentação", "apenas pela mãe", "mais pelo avô"],
      c: 0,
      e: "Os filhos herdam os genes dos pais, que definem suas características."
    },
    {
      q: "A Era Vargas (1930–1945) é marcada por:",
      o: ["industrialização e criação de leis trabalhistas", "o fim da indústria", "a volta da monarquia", "a ausência do Estado", "a abolição das leis"],
      c: 0,
      e: "No governo Vargas o país se industrializou e surgiram as principais leis trabalhistas."
    },
    {
      q: "A CLT, criada no governo Vargas, regulamentou:",
      o: ["os direitos dos trabalhadores", "os impostos das fábricas", "o comércio exterior", "a agricultura familiar", "a educação básica"],
      c: 0,
      e: "A CLT consolidou as leis do trabalho, como férias, carteira e salário mínimo."
    },
    {
      q: "A industrialização brasileira se acelerou:",
      o: ["no século XX, ganhando força na Era Vargas", "no século XVI, com o café", "apenas após o ano 2000", "durante a era colonial", "na pré-história"],
      c: 0,
      e: "A partir da década de 1930 o Brasil desenvolveu indústria de base e bens de consumo."
    },
    {
      q: "A Ditadura Militar brasileira ocorreu entre:",
      o: ["1964 e 1985", "1930 e 1945", "1889 e 1910", "1945 e 1954", "1985 e 2002"],
      c: 0,
      e: "O regime militar durou de 1964 a 1985."
    },
    {
      q: "Durante a Ditadura Militar no Brasil, houve:",
      o: ["censura e repressão a opositores", "liberdade total de imprensa", "eleições todos os anos", "fim das instituições", "ausência de censura"],
      c: 0,
      e: "O regime censurou a imprensa e perseguiu adversários políticos."
    },
    {
      q: "A redemocratização (1985) resultou:",
      o: ["na volta das eleições diretas e da democracia", "em uma nova ditadura", "no fim das eleições", "na instauração da monarquia", "na censura permanente"],
      c: 0,
      e: "Em 1985 a ditadura terminou e o país retomou o caminho democrático."
    },
    {
      q: "A Constituição brasileira de 1988 ficou conhecida como:",
      o: ["Constituição Cidadã", "Carta Imperial", "Constituição do Ato Adicional", "Lei Áurea", "Constituição Militar"],
      c: 0,
      e: "A Constituição de 1988 ampliou direitos sociais e garantias individuais, por isso é chamada Cidadã."
    }
  ],

  s8: [
    {
      q: "Em “O menino atravessou a rua correndo”, o núcleo do sujeito é:",
      o: ["menino", "rua", "correndo", "atravessou", "o"],
      c: 0,
      e: "O sujeito é “O menino”; seu núcleo (palavra principal) é “menino”."
    },
    {
      q: "15% de 200 é igual a:",
      o: ["30", "15", "20", "300", "3"],
      c: 0,
      e: "0,15 × 200 = 30."
    },
    {
      q: "O valor de √49 + 3² é:",
      o: ["16", "10", "52", "58", "14"],
      c: 0,
      e: "√49 = 7 e 3² = 9; 7 + 9 = 16."
    },
    {
      q: "Na fotossíntese, as plantas produzem:",
      o: ["glicose e oxigênio", "gás carbônico e água", "nitrogênio puro", "apenas calor", "proteínas do solo"],
      c: 0,
      e: "A fotossíntese usa luz para transformar CO₂ e água em glicose e oxigênio."
    },
    {
      q: "O maior país da América do Sul é o:",
      o: ["Brasil", "Argentina", "Chile", "Peru", "Colômbia"],
      c: 0,
      e: "O Brasil é o maior país em área da América do Sul."
    },
    {
      q: "A Guerra Fria foi a disputa entre:",
      o: ["EUA e URSS", "França e Inglaterra", "Brasil e Argentina", "China e Japão", "Alemanha e Itália"],
      c: 0,
      e: "EUA (capitalismo) e URSS (socialismo) disputaram hegemonia no pós-1945."
    },
    {
      q: "Complete com o artigo correto: “That is ___ apple.”",
      o: ["an", "a", "the", "no", "is"],
      c: 0,
      e: "Antes de vogal, usa-se “an”: an apple."
    },
    {
      q: "Em “A menina feliz saiu”, a palavra “feliz” é:",
      o: ["adjetivo", "verbo", "advérbio", "substantivo", "preposição"],
      c: 0,
      e: "“Feliz” caracteriza “menina”, atuando como adjetivo."
    },
    {
      q: "Resolva a equação 5x = 40. O valor de x é:",
      o: ["8", "35", "45", "4", "200"],
      c: 0,
      e: "x = 40/5 = 8."
    },
    {
      q: "A molécula da água é formada por:",
      o: ["hidrogênio e oxigênio", "sódio e cloro", "carbono e nitrogênio", "apenas oxigênio", "enxofre e ferro"],
      c: 0,
      e: "A água (H₂O) combina dois átomos de hidrogênio e um de oxigênio."
    },
    {
      q: "A linha do Equador divide a Terra nos hemisférios:",
      o: ["norte e sul", "leste e oeste", "dia e noite", "continente e oceano", "quente e frio"],
      c: 0,
      e: "O Equador é a linha imaginária que separa norte e sul."
    },
    {
      q: "A abolição da escravatura no Brasil, em 1888, ocorreu pela:",
      o: ["Lei Áurea", "Lei do Ventre Livre", "Lei dos Sexagenários", "Lei das Sesmarias", "Lei do Ato Adicional"],
      c: 0,
      e: "A Lei Áurea, assinada pela princesa Isabel, libertou os escravizados em 1888."
    },
    {
      q: "A expressão “good morning” significa:",
      o: ["bom dia", "boa noite", "boa tarde", "olá", "até logo"],
      c: 0,
      e: "“Good morning” = bom dia (saudação da manhã)."
    },
    {
      q: "A média aritmética de 8, 9 e 10 é:",
      o: ["9", "8", "10", "27", "8,5"],
      c: 0,
      e: "(8 + 9 + 10) ÷ 3 = 27 ÷ 3 = 9."
    },
    {
      q: "Qual frase está pontuada corretamente?",
      o: ["Quantos anos você tem?", "Quantos anos você tem.", "Quantos anos você tem!", "Quantos anos você tem,", "Quantos você anos tem?."],
      c: 0,
      e: "Perguntas diretas terminam com ponto de interrogação."
    }
  ]
};

export function getProvaQuestions(week) {
  return (PROVA_QUESTIONS[week] || []).map((q, i) => ({ ...q, id: `${week}q${i + 1}` }));
}