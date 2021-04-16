export class Category{
    title: string;
    category: Categories
}

export class SubCategory{
    title: string;
    category: Categories;
    subCategory: SubCategories;
    value: number;
}

export enum Categories {
    Eletronics,
    Software,
    Cloths,
    Self_Care,
    Home_Appliances,
    Furniture,
    Hobbies,
    Construction,
    Health,
    Others,
    Services
}

export enum SubCategories {
    //Eletronics
    Computador, //0
    Notebook, //1
    Hardware, //2
    Celular, //3
    Camera, //4
    Console, //5
    Headset, //6
    Audio, //7
    Controle_Remoto, //8
    Projetor, //9
    Roteador,//10
    Cabos, //11
    Componentes, //12
    Outros_Eletronicos, //13

    //Software
    Producao, //14
    Jogos, //15
    Sistema_Operacional, //16
    Outros_Software, //17

    //Cloths
    Moda_Masculina, //18
    Moda_Feminina, //19
    Infantil_Masculino, //20
    Infantil_Feminino, //21
    Bebe, //22
    Camisa, //23
    Blusa, //24
    Casaco, //25
    Calca, //26
    Bermuda, //27
    Legging, //28
    Macacao, //29
    Saia, //30
    Terno, //31
    Vestido, //32
    Intimo_Masculino, //33
    Intimo_Feminino, //34
    Praia_e_Piscina, //35
    Sapato, //36
    Chinelo, //37
    Outros_Roupas, //38

    //Self Care
    Perfume, //39
    Barbeador, //40
    Creme_para_Pele, //41
    Creme_para_Cabelo, //42
    Maquiagem, //43
    Escova_e_Pente, //44
    Bucal, //45
    Secador_de_Cabelo, //46
    Outros_Cuidados_Pessoais, //47

    //Home Appliances
    Home_Theater, //48
    DVD, //49
    Televisao, //50
    Ar_Condicionado, //51
    Ventilador, //52
    Aquecedor, //53
    Fogao, //54
    Liquidificador, //55
    Purificador_de_Agua, //56
    Geladeira, //57
    Outros_Eletrodomesticos, //58

    //Furniture
    Escritorio, //59
    Banheiro, //60
    Sala, //61
    Cozinha, //62
    Quarto, //63
    Copa, //64
    Jardim, //65
    Iluminacao, //66
    Enfeites, //67
    Outros_Moveis, //68

    //Hobbies
    Esporte, //69
    Musica, //70
    Filme, //71
    Series, //72
    Ar_Livre, //73
    Pintura, //74
    Brinquedo, //75
    Jogos_de_Mesa, //76
    Jogos_de_Salao, //77
    Outros_Hobbies, //78

    //Construction
    Acessorios_de_Construcao, //79
    Tinta, //80
    Maquina_de_Contrucao, //81
    Material_para_Obra, //82
    Piso, //83
    Azulejo, //84
    Energia, //85
    Rejunte_e_Massas, //86
    Outros_Construcao, //87

    //Health
    Mascara, //88
    Farmacia, //89
    Termometro, //90
    Nebulizador, //91
    Balanca, //92
    Ortopedia, //93
    Equipamento_Medico, //94
    Suplemento_Alimentar, //95
    Outros_Saude, //96

    //Others
    Gift_Card, //97
    Criptomoeda, //98
    Outros, //99

    //Services
    Academia, //100
    Educacao, //101
    Festa_e_Evento, //102
    Internet, //103
    Saude, //104
    Transporte, //105
    Suporte_Tecnico, //106
    Viagem, //107
    Vestimento, //108
    Impressao, //109
    Gastronomia, //110
    Estetica_e_Design, //111
    Outros_Profissionais, //112
    Outros_Servicos, //113
}
