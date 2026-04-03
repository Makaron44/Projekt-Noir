// Case 3: Widmo Opery - Zatrucie na premierze
export const case3 = {
  id: "opera",
  title: "Widmo Opery",
  subtitle: "Zatrucie na premierze w Operze Królewskiej",
  difficulty: "★★★★",
  estimate: "~30 min",
  startingRoom: "foyer",
  rooms: {
    foyer: {
      name: "Foyer Opery",
      description: "Wielki foyer Opery Królewskiej. Marmurowe schody prowadzą na piętro. Premiera 'Toski' została przerwana, gdy śpiewaczka Elżbieta Stern upadła na scenie. Na stoliku leży program wieczoru. Goście czekają przy barze, szepcząc nerwowo.",
      nodes: [
        { id: "idz_scena", label: "Scena i Kulisy", target: "scena", icon: "DoorClosed" },
        { id: "idz_garderoba", label: "Garderoba Gwiazdy", target: "garderoba", icon: "DoorClosed" },
        { id: "idz_bar", label: "Bar i Restauracja", target: "bar", icon: "DoorClosed" },
        { id: "idz_biuro_opera", label: "Biuro Dyrektora", target: "biuro_opery", icon: "DoorClosed" },
        { id: "idz_balkon", label: "Loża Balkonowa", target: "balkon", icon: "DoorClosed" },
        { id: "program", label: "Program Wieczoru", action: "examine_program", icon: "FileText" },
        { id: "zakonczenie3", label: "Wskaż Mordercę", action: "ending_check", icon: "AlertCircle" }
      ]
    },
    scena: {
      name: "Scena i Kulisy",
      description: "Za kurtynę zwisają sznury i ciężary. Na scenie wciąż stoją rekwizyty z 'Toski'. Po prawej stronie stół z rekwizytami — w tym kielich, z którego piła Stern. Obok leży porzucony bukiet róż.",
      nodes: [
        { id: "kielich", label: "Kielich ze Sceny", action: "examine_goblet", icon: "Search" },
        { id: "bukiet", label: "Bukiet Róż", action: "examine_flowers", icon: "Search" },
        { id: "rekwizyty", label: "Stół z Rekwizytami", action: "examine_props_table", icon: "Search" },
        { id: "ciemny_kat", label: "Ciemny Kąt za Kurtyną", action: "examine_dark_corner", icon: "Search" },
        { id: "technik", label: "Porozmawiaj z Technikiem", action: "talk_technician", icon: "AlertCircle" },
        { id: "powrot_foyer_s", label: "Wróć do Foyer", target: "foyer", icon: "ChevronLeft" }
      ]
    },
    garderoba: {
      name: "Garderoba Gwiazdy",
      description: "Luksusowa garderoba Elżbiety Stern. Lustro otoczone żarówkami, wśród których jedna nie świeci. Na toaletce stoi mnóstwo kosmetyków, butelka wina i szklanka. Na wieszaku wisi jej kostium sceniczny. W rogu stoi walizka podróżna.",
      nodes: [
        { id: "toaletka", label: "Toaletka z Kosmetykami", action: "examine_vanity", icon: "Search" },
        { id: "wino_garderoba", label: "Butelka Wina", action: "examine_wine", icon: "Search" },
        { id: "walizka_stern", label: "Walizka Podróżna", action: "examine_suitcase", icon: "Lock" },
        { id: "listy_garderoba", label: "Listy na Stoliku", action: "examine_letters", icon: "FileText" },
        { id: "lustro", label: "Zbadaj Lustro", action: "examine_mirror", icon: "Search" },
        { id: "powrot_foyer_g", label: "Wróć do Foyer", target: "foyer", icon: "ChevronLeft" }
      ]
    },
    bar: {
      name: "Bar i Restauracja",
      description: "Elegancki bar z mahoniu. Barman Jan czyści szklanki, unikając kontaktu wzrokowego. Na barze stoi karafa z whisky i menu. Przy stoliku w rogu siedzi krytyk muzyczny Zawadzki, pijąc nerwowo.",
      nodes: [
        { id: "rozmowa_barman", label: "Porozmawiaj z Barmanem", action: "talk_barman", icon: "AlertCircle" },
        { id: "rozmowa_krytyk", label: "Porozmawiaj z Krytykiem", action: "talk_critic", icon: "AlertCircle" },
        { id: "bar_ladowanie", label: "Przeszukaj za Barem", action: "search_behind_bar", icon: "Search" },
        { id: "menu_bar", label: "Menu i Zamówienia", action: "examine_orders", icon: "FileText" },
        { id: "powrot_foyer_b", label: "Wróć do Foyer", target: "foyer", icon: "ChevronLeft" }
      ]
    },
    biuro_opery: {
      name: "Biuro Dyrektora Opery",
      description: "Ciemne biuro z portretami dawnych dyrektorów. Dyrektor Malinowski siedzi za biurkiem, blady jak ściana. Na biurku leżą kontrakty, a w koszu widać pogniecione kartki. Szafa pancerna stoi uchylona.",
      nodes: [
        { id: "rozmowa_dyrektor_o", label: "Porozmawiaj z Dyrektorem", action: "talk_opera_director", icon: "AlertCircle" },
        { id: "kontrakty", label: "Kontrakty na Biurku", action: "examine_contracts", icon: "FileText" },
        { id: "kosz_biuro", label: "Kosz na Śmieci", action: "examine_office_trash", icon: "Search" },
        { id: "szafa_pancerna", label: "Szafa Pancerna", action: "examine_safe_opera", icon: "Lock" },
        { id: "powrot_foyer_bi", label: "Wróć do Foyer", target: "foyer", icon: "ChevronLeft" }
      ]
    },
    balkon: {
      name: "Loża Balkonowa nr 5",
      description: "Ekskluzywna loża z widokiem na scenę. Aksamitne fotele, lornetka na poręczy. Tu siedział tajemniczy gość, który zamówił bukiet róż dla Stern. Na podłodze leży zapalniczka z monogramem 'R.Z.'",
      nodes: [
        { id: "lornetka", label: "Lornetka", action: "examine_binoculars", icon: "Search" },
        { id: "zapalniczka", label: "Zapalniczka z Monogramem", action: "examine_lighter", icon: "Search" },
        { id: "fotel_balkon", label: "Przeszukaj Fotel", action: "search_seat", icon: "Search" },
        { id: "powrot_foyer_ba", label: "Wróć do Foyer", target: "foyer", icon: "ChevronLeft" }
      ]
    }
  },
  items: {
    program:         { name: "Program Wieczoru",       desc: "Obsada: Stern, Kowalczyk (dublerka). Reżyser: Malinowski.",  icon: "FileText" },
    kielich_dowod:   { name: "Kielich (Dowód)",        desc: "Ślady substancji na dnie. Kielich ze sceny.",                icon: "Search" },
    fiolka:          { name: "Pusta Fiolka",           desc: "Etykieta: 'Aconitum'. Tojad — silna trucizna.",              icon: "Search" },
    bukiet_karta:    { name: "Kartka z Bukietu",       desc: "\"Twój ostatni występ. — R.Z.\"",                            icon: "FileText" },
    klucz_walizki:   { name: "Klucz do Walizki",      desc: "Mały, srebrny klucz.",                                       icon: "Key" },
    list_milosny:    { name: "List Miłosny",           desc: "\"Kochana E., odejdź ze mną. Rzuć to wszystko. — R.\"",      icon: "FileText" },
    list_szantaz:    { name: "List Szantażysty",       desc: "\"Wiem o fałszywej polisie. Zapłać albo...\"",               icon: "FileText" },
    polisa_opera:    { name: "Polisa na Życie",        desc: "Stern ubezpieczona na 2 mln. Beneficjent: mąż Rudolf.",      icon: "FileText" },
    zapalniczka_rz:  { name: "Zapalniczka R.Z.",       desc: "Złota. Monogram: R.Z. — Rudolf Zawadzki?",                   icon: "Search" },
    zapis_kamer:     { name: "Zapis z Kamery",         desc: "Ktoś podchodzi do kielicha o 20:45. Mężczyzna w smokingu.",   icon: "Camera" },
    zeznanie_barmana:{ name: "Zeznanie Barmana",       desc: "\"Zawadzki zamówił specjalne wino i sam je zaniósł za kulisy.\"", icon: "FileText" },
    kontrakt_dubler: { name: "Kontrakt Dublerki",      desc: "Kowalczyk przejęłaby rolę i kontrakt w razie 'wypadku'.",    icon: "FileText" },
    notatka_trucizna:{ name: "Notatka o Truciźnie",    desc: "\"Aconitum: dawka śmiertelna 2mg. Działa w 30 min.\"",       icon: "FileText" },
    receptura:       { name: "Receptura z Apteki",     desc: "Ktoś kupił ekstrakt z tojadu. Podpis nieczytelny.",          icon: "FileText" },
    bilet_lotniczy:  { name: "Bilety Lotnicze",        desc: "2 bilety do Buenos Aires. Na nazwiska: R. Zawadzki, E. Stern.", icon: "Ticket" }
  },
  victoryText: "Sprawa rozwiązana! Rudolf Zawadzki — krytyk muzyczny i kochanek Elżbiety Stern — próbował ją otruć toadem wsypanym do kielicha scenicznego. Motyw: Stern odmówiła ucieczki do Buenos Aires, a Zawadzki wykupił polisę na jej życie. Udawał zakochanego, ale chodziło mu o pieniądze z ubezpieczenia. Dzięki zeznaniu barmana, fiolce z truciną i biletom lotniczym sprawa jest zamknięta. Stern przeżyła — dawka była zbyt mała. Genialna robota, detektywie!"
};
