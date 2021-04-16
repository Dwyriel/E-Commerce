import { SubCategories, Categories, SubCategory, Category } from './categories'

export class ItemClassification {

    private static eletronics: SubCategory[] = [
        { title: "Computador", category: Categories.Eletronics, subCategory: SubCategories.Computador, value: 0 },
        { title: "Notebook", category: Categories.Eletronics, subCategory: SubCategories.Notebook, value: 1 },
        { title: "Hardware", category: Categories.Eletronics, subCategory: SubCategories.Hardware, value: 2 },
        { title: "Celular", category: Categories.Eletronics, subCategory: SubCategories.Celular, value: 3 },
        { title: "Camera", category: Categories.Eletronics, subCategory: SubCategories.Camera, value: 4 },
        { title: "Console", category: Categories.Eletronics, subCategory: SubCategories.Console, value: 5 },
        { title: "Headset", category: Categories.Eletronics, subCategory: SubCategories.Headset, value: 6 },
        { title: "Audio", category: Categories.Eletronics, subCategory: SubCategories.Audio, value: 7 },
        { title: "Controle Remoto", category: Categories.Eletronics, subCategory: SubCategories.Controle_Remoto, value: 8 },
        { title: "Projetor", category: Categories.Eletronics, subCategory: SubCategories.Projetor, value: 9 },
        { title: "Roteador", category: Categories.Eletronics, subCategory: SubCategories.Roteador, value: 10 },
        { title: "Cabos", category: Categories.Eletronics, subCategory: SubCategories.Cabos, value: 11 },
        { title: "Componentes", category: Categories.Eletronics, subCategory: SubCategories.Componentes, value: 12 },
        { title: "Outros", category: Categories.Eletronics, subCategory: SubCategories.Outros_Eletronicos, value: 13 }
    ];

    private static software: SubCategory[] = [
        { title: "Produção", category: Categories.Software, subCategory: SubCategories.Producao, value: 14 },
        { title: "Jogos", category: Categories.Software, subCategory: SubCategories.Jogos, value: 15 },
        { title: "Sistema Operacional", category: Categories.Software, subCategory: SubCategories.Sistema_Operacional, value: 16 },
        { title: "Outros", category: Categories.Software, subCategory: SubCategories.Outros_Software, value: 17 },
    ];

    private static cloths: SubCategory[] = [
        { title: "Moda Masculina", category: Categories.Cloths, subCategory: SubCategories.Moda_Masculina, value: 18 },
        { title: "Moda Feminina", category: Categories.Cloths, subCategory: SubCategories.Moda_Feminina, value: 19 },
        { title: "Infantil Masculino", category: Categories.Cloths, subCategory: SubCategories.Infantil_Masculino, value: 20 },
        { title: "Infantil Feminino", category: Categories.Cloths, subCategory: SubCategories.Infantil_Feminino, value: 21 },
        { title: "Bebê", category: Categories.Cloths, subCategory: SubCategories.Bebe, value: 22 },
        { title: "Camisa", category: Categories.Cloths, subCategory: SubCategories.Camisa, value: 23 },
        { title: "Blusa", category: Categories.Cloths, subCategory: SubCategories.Blusa, value: 24 },
        { title: "Casaco", category: Categories.Cloths, subCategory: SubCategories.Casaco, value: 25 },
        { title: "Calça", category: Categories.Cloths, subCategory: SubCategories.Calca, value: 26 },
        { title: "Bermuda", category: Categories.Cloths, subCategory: SubCategories.Bermuda, value: 27 },
        { title: "Legging", category: Categories.Cloths, subCategory: SubCategories.Legging, value: 28 },
        { title: "Macacão", category: Categories.Cloths, subCategory: SubCategories.Macacao, value: 29 },
        { title: "Saia", category: Categories.Cloths, subCategory: SubCategories.Saia, value: 30 },
        { title: "Terno", category: Categories.Cloths, subCategory: SubCategories.Terno, value: 31 },
        { title: "Vestido", category: Categories.Cloths, subCategory: SubCategories.Vestido, value: 32 },
        { title: "Intimo Masculino", category: Categories.Cloths, subCategory: SubCategories.Intimo_Masculino, value: 33 },
        { title: "Intimo Feminino", category: Categories.Cloths, subCategory: SubCategories.Intimo_Feminino, value: 34 },
        { title: "Praia e Piscina", category: Categories.Cloths, subCategory: SubCategories.Praia_e_Piscina, value: 35 },
        { title: "Sapato", category: Categories.Cloths, subCategory: SubCategories.Sapato, value: 36 },
        { title: "Chinelo", category: Categories.Cloths, subCategory: SubCategories.Chinelo, value: 37 },
        { title: "Outros", category: Categories.Cloths, subCategory: SubCategories.Outros_Roupas, value: 38 },
    ];

    private static selfCare: SubCategory[] = [
        { title: "Perfume", category: Categories.Self_Care, subCategory: SubCategories.Perfume, value: 39 },
        { title: "Barbeador", category: Categories.Self_Care, subCategory: SubCategories.Barbeador, value: 40 },
        { title: "Creme para Pele", category: Categories.Self_Care, subCategory: SubCategories.Creme_para_Pele, value: 41 },
        { title: "Creme para Cabelo", category: Categories.Self_Care, subCategory: SubCategories.Creme_para_Cabelo, value: 42 },
        { title: "Maquiagem", category: Categories.Self_Care, subCategory: SubCategories.Maquiagem, value: 43 },
        { title: "Escova e Pente", category: Categories.Self_Care, subCategory: SubCategories.Escova_e_Pente, value: 44 },
        { title: "Bucal", category: Categories.Self_Care, subCategory: SubCategories.Bucal, value: 45 },
        { title: "Secador de Cabelo", category: Categories.Self_Care, subCategory: SubCategories.Secador_de_Cabelo, value: 46 },
        { title: "Outros", category: Categories.Self_Care, subCategory: SubCategories.Outros_Cuidados_Pessoais, value: 47 },
    ];

    private static homeAppliances: SubCategory[] = [
        { title: "Home Theater", category: Categories.Home_Appliances, subCategory: SubCategories.Home_Theater, value: 48 },
        { title: "DVD", category: Categories.Home_Appliances, subCategory: SubCategories.DVD, value: 49 },
        { title: "Televisão", category: Categories.Home_Appliances, subCategory: SubCategories.Televisao, value: 50 },
        { title: "Ar Condicionado", category: Categories.Home_Appliances, subCategory: SubCategories.Ar_Condicionado, value: 51 },
        { title: "Ventilador", category: Categories.Home_Appliances, subCategory: SubCategories.Ventilador, value: 52 },
        { title: "Aquecedor", category: Categories.Home_Appliances, subCategory: SubCategories.Aquecedor, value: 53 },
        { title: "Fogão", category: Categories.Home_Appliances, subCategory: SubCategories.Fogao, value: 54 },
        { title: "Liquidificador", category: Categories.Home_Appliances, subCategory: SubCategories.Liquidificador, value: 55 },
        { title: "Purificador de Agua", category: Categories.Home_Appliances, subCategory: SubCategories.Purificador_de_Agua, value: 56 },
        { title: "Geladeira", category: Categories.Home_Appliances, subCategory: SubCategories.Geladeira, value: 57 },
        { title: "Outros", category: Categories.Home_Appliances, subCategory: SubCategories.Outros_Eletrodomesticos, value: 58 },
    ];

    private static furniture: SubCategory[] = [
        { title: "Escritorio", category: Categories.Furniture, subCategory: SubCategories.Escritorio, value: 59 },
        { title: "Banheiro", category: Categories.Furniture, subCategory: SubCategories.Banheiro, value: 60 },
        { title: "Sala", category: Categories.Furniture, subCategory: SubCategories.Sala, value: 61 },
        { title: "Cozinha", category: Categories.Furniture, subCategory: SubCategories.Cozinha, value: 62 },
        { title: "Quarto", category: Categories.Furniture, subCategory: SubCategories.Quarto, value: 63 },
        { title: "Copa", category: Categories.Furniture, subCategory: SubCategories.Copa, value: 64 },
        { title: "Jardim", category: Categories.Furniture, subCategory: SubCategories.Jardim, value: 65 },
        { title: "Iluminação", category: Categories.Furniture, subCategory: SubCategories.Iluminacao, value: 66 },
        { title: "Enfeites", category: Categories.Furniture, subCategory: SubCategories.Enfeites, value: 67 },
        { title: "Outros", category: Categories.Furniture, subCategory: SubCategories.Outros_Moveis, value: 68 },
    ];

    private static hobbies: SubCategory[] = [
        { title: "Esporte", category: Categories.Hobbies, subCategory: SubCategories.Esporte, value: 69 },
        { title: "Musica", category: Categories.Hobbies, subCategory: SubCategories.Musica, value: 70 },
        { title: "Filme", category: Categories.Hobbies, subCategory: SubCategories.Filme, value: 71 },
        { title: "Serie", category: Categories.Hobbies, subCategory: SubCategories.Series, value: 72 },
        { title: "Ar Livre", category: Categories.Hobbies, subCategory: SubCategories.Ar_Livre, value: 73 },
        { title: "Pintura", category: Categories.Hobbies, subCategory: SubCategories.Pintura, value: 74 },
        { title: "Brinquedo", category: Categories.Hobbies, subCategory: SubCategories.Brinquedo, value: 75 },
        { title: "Jogo de Mesa", category: Categories.Hobbies, subCategory: SubCategories.Jogos_de_Mesa, value: 76 },
        { title: "Jogo de Salão", category: Categories.Hobbies, subCategory: SubCategories.Jogos_de_Salao, value: 77 },
        { title: "Outros", category: Categories.Hobbies, subCategory: SubCategories.Outros_Hobbies, value: 78 },
    ];

    private static construction: SubCategory[] = [
        { title: "Acessorio de Construção", category: Categories.Construction, subCategory: SubCategories.Acessorios_de_Construcao, value: 79 },
        { title: "Tinta", category: Categories.Construction, subCategory: SubCategories.Tinta, value: 80 },
        { title: "Maquina de Construção", category: Categories.Construction, subCategory: SubCategories.Maquina_de_Contrucao, value: 81 },
        { title: "Material para Obra", category: Categories.Construction, subCategory: SubCategories.Material_para_Obra, value: 82 },
        { title: "Piso", category: Categories.Construction, subCategory: SubCategories.Piso, value: 83 },
        { title: "Azulejo", category: Categories.Construction, subCategory: SubCategories.Azulejo, value: 84 },
        { title: "Energia", category: Categories.Construction, subCategory: SubCategories.Energia, value: 85 },
        { title: "Rejunte e Massas", category: Categories.Construction, subCategory: SubCategories.Rejunte_e_Massas, value: 86 },
        { title: "Outros", category: Categories.Construction, subCategory: SubCategories.Outros_Construcao, value: 87 },
    ];

    private static health: SubCategory[] = [
        { title: "Mascara", category: Categories.Health, subCategory: SubCategories.Mascara, value: 88 },
        { title: "Farmacia", category: Categories.Health, subCategory: SubCategories.Farmacia, value: 89 },
        { title: "Termometro", category: Categories.Health, subCategory: SubCategories.Termometro, value: 90 },
        { title: "Nebulizador", category: Categories.Health, subCategory: SubCategories.Nebulizador, value: 91 },
        { title: "Balança", category: Categories.Health, subCategory: SubCategories.Balanca, value: 92 },
        { title: "Ortopedia", category: Categories.Health, subCategory: SubCategories.Ortopedia, value: 93 },
        { title: "Equipamento Medico", category: Categories.Health, subCategory: SubCategories.Equipamento_Medico, value: 94 },
        { title: "Suplemento Alimentar", category: Categories.Health, subCategory: SubCategories.Suplemento_Alimentar, value: 95 },
        { title: "Outros", category: Categories.Health, subCategory: SubCategories.Outros_Saude, value: 96 },
    ];

    private static others: SubCategory[] = [
        { title: "Gift Card", category: Categories.Others, subCategory: SubCategories.Gift_Card, value: 97 },
        { title: "Criptomoeda", category: Categories.Others, subCategory: SubCategories.Criptomoeda, value: 98 },
        { title: "Outros", category: Categories.Others, subCategory: SubCategories.Outros, value: 99 },
    ];

    private static services: SubCategory[] = [
        { title: "", category: Categories.Services, subCategory: SubCategories.Academia, value: 100 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Educacao, value: 101 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Festa_e_Evento, value: 102 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Internet, value: 103 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Saude, value: 104 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Transporte, value: 105 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Suporte_Tecnico, value: 106 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Viagem, value: 107 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Vestimento, value: 108 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Impressao, value: 109 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Gastronomia, value: 110 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Estetica_e_Design, value: 111 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Outros_Profissionais, value: 112 },
        { title: "", category: Categories.Services, subCategory: SubCategories.Outros_Servicos, value: 113 },
    ];

    private static cats: Category[] = [
        { title: "Eletrônico", category: Categories.Eletronics },
        { title: "Software", category: Categories.Software },
        { title: "Roupas", category: Categories.Cloths },
        { title: "Cuidado Pessoal", category: Categories.Self_Care },
        { title: "Eletrodomésticos", category: Categories.Home_Appliances },
        { title: "Moveis", category: Categories.Furniture },
        { title: "Hobbies", category: Categories.Hobbies },
        { title: "Construção", category: Categories.Construction },
        { title: "Saude", category: Categories.Health },
        { title: "Outros", category: Categories.Others },
        { title: "Serviços", category: Categories.Services },
    ];

    private static subCats: SubCategories[] = [].concat.apply([], [
        ItemClassification.eletronics,
        ItemClassification.software,
        ItemClassification.cloths,
        ItemClassification.selfCare,
        ItemClassification.homeAppliances,
        ItemClassification.furniture,
        ItemClassification.hobbies,
        ItemClassification.construction,
        ItemClassification.health,
        ItemClassification.others,
        ItemClassification.services,
    ]);

    public static SubCategories() {
        return this.subCats;
    }

    public static Categories() {
        return this.cats;
    }

    public static getSubCatFrom(category: Categories): SubCategory[] {
        switch (category) {
            case Categories.Eletronics:
                return this.eletronics;
            case Categories.Software:
                return this.software;
            case Categories.Cloths:
                return this.cloths;
            case Categories.Self_Care:
                return this.selfCare;
            case Categories.Home_Appliances:
                return this.homeAppliances;
            case Categories.Furniture:
                return this.furniture;
            case Categories.Hobbies:
                return this.hobbies;
            case Categories.Construction:
                return this.construction;
            case Categories.Health:
                return this.health;
            case Categories.Others:
                return this.others;
            case Categories.Services:
                return this.services;
            default:
                return null;
        }
    }
}
