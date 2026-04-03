// Case 1: Posiadłość Blackwood (existing story)
export const case1 = {
  id: "blackwood",
  title: "Posiadłość Blackwood",
  subtitle: "Morderstwo lorda w jego własnym domu",
  difficulty: "★★☆",
  estimate: "~15 min",
  startingRoom: "hol",
  rooms: {
    hol: {
      name: "Główny Hol",
      description: "Znajdujesz się w okazałym holu posiadłości Blackwood. Zegar tyka złowieszczo, a zapach wiekowej dębiny miesza się z wonią deszczu wpadającego przez uchylone drzwi. Na podłodze widać świeże ślady błota prowadzące do ogrodu.",
      nodes: [
        { id: "drzwi_gabinet", label: "Wejdź do Gabinetu", target: "gabinet", icon: "DoorClosed" },
        { id: "drzwi_biblioteka", label: "Idź do Biblioteki", target: "biblioteka", icon: "BookOpen" },
        { id: "drzwi_ogrod", label: "Wyjdź do Ogrodu", target: "ogrod", icon: "Map" },
        { id: "drzwi_piwnica", label: "Zejdź do Piwnicy", target: "piwnica", icon: "ChevronLeft" },
        { id: "drzwi_sluzba", label: "Pokój Służby", target: "pokoj_sluzby", icon: "Home" },
        { id: "oskarzenie", label: "Zakończ Śledztwo", action: "ending_check", icon: "AlertCircle" }
      ]
    },
    gabinet: {
      name: "Mroczny Gabinet",
      description: "Mroczny pokój oświetlony jedynie dogasającym żarem z kominka. Na środku, twarzą do ziemi, leży lord Blackwood. W kącie stoi masywny sejf i dębowe biurko. Na ścianie wisi kratka wentylacyjna.",
      nodes: [
        { id: "cialo", label: "Zbadaj Ciało", action: "examine_body", icon: "Search" },
        { id: "biurko", label: "Przeszukaj Biurko", action: "examine_desk", icon: "FileText" },
        { id: "sejf", label: "Otwórz Sejf", action: "open_safe", icon: "Lock" },
        { id: "kratka", label: "Kratka Wentylacyjna", action: "examine_vent", icon: "Settings" },
        { id: "powrot_hol_g", label: "Wróć do Holu", target: "hol", icon: "ChevronLeft" }
      ]
    },
    biblioteka: {
      name: "Biblioteka",
      description: "Ściany wyłożone tysiącami ksiąg. Atmosfera jest tu ciężka i duszna. Pośrodku stoi biurko do czytania, na którym leży otwarta książka. Za jednym z regałów coś dziwnie szczelnie przylega do ściany.",
      nodes: [
        { id: "regal", label: "Regał z Książkami", action: "examine_books", icon: "Library" },
        { id: "biurko_czytelnia", label: "Biurko do Czytania", action: "examine_reading_desk", icon: "Book" },
        { id: "ukryte_przejscie", label: "Podejrzana Ściana", action: "hidden_passage", icon: "Search" },
        { id: "powrot_hol_b", label: "Wróć do Holu", target: "hol", icon: "ChevronLeft" }
      ]
    },
    ogrod: {
      name: "Zaniedbany Ogród",
      description: "Zimny deszcz siecze po twarzy. Ślady w błocie prowadzą w stronę starej szopy na narzędzia. Obok szopy stoi drewniana ławka, a pod nią widać coś metalowego.",
      nodes: [
        { id: "sciezka", label: "Błotnista Ścieżka", action: "examine_path", icon: "Footprints" },
        { id: "szopa", label: "Szopa Ogrodnika", action: "enter_shed", icon: "Home" },
        { id: "lawka", label: "Stara Ławka", action: "examine_bench", icon: "Search" },
        { id: "powrot_hol_o", label: "Wróć do Holu", target: "hol", icon: "ChevronLeft" }
      ]
    },
    piwnica: {
      name: "Piwnica",
      description: "Wilgotna, zimna piwnica. Światło ledwo tu dociera. Ściany pokryte są pleśnią, ale w jednym miejscu widać ślady po zdrapywaniu farby. Na podłodze leży stara skrzynka na wino.",
      nodes: [
        { id: "sciana_piwnica", label: "Zdrapana Ściana", action: "examine_cellar_wall", icon: "Search" },
        { id: "skrzynka", label: "Skrzynka na Wino", action: "examine_crate", icon: "Search" },
        { id: "powrot_hol_p", label: "Wróć do Holu", target: "hol", icon: "ChevronLeft" }
      ]
    },
    pokoj_sluzby: {
      name: "Pokój Służby",
      description: "Mały, skromny pokój. Pokojówka Martha siedzi na krześle i nerwowo skubie fartuch. Wygląda, jakby chciała coś powiedzieć, ale boi się. Na stoliku obok niej leży pusta filiżanka po herbacie.",
      nodes: [
        { id: "rozmowa_martha", label: "Porozmawiaj z Marthą", action: "talk_martha", icon: "AlertCircle" },
        { id: "filizanka", label: "Zbadaj Filiżankę", action: "examine_cup", icon: "Search" },
        { id: "szafka_sluzby", label: "Szafka Pokojówki", action: "examine_servant_cabinet", icon: "Lock" },
        { id: "powrot_hol_s", label: "Wróć do Holu", target: "hol", icon: "ChevronLeft" }
      ]
    },
    ukryty_pokoj: {
      name: "Ukryty Pokój",
      description: "Za regałem odkrywasz ciasny, zakurzony pokój. Na ścianie wisi mapa z zaznaczonymi trasami kolejowymi. Na biurku leży list napisany nerwowym pismem i pudełko z amunicją.",
      nodes: [
        { id: "mapa_ucieczki", label: "Mapa z Trasami", action: "examine_escape_map", icon: "Map" },
        { id: "list_ukryty", label: "Tajemniczy List", action: "examine_hidden_letter", icon: "FileText" },
        { id: "powrot_biblioteka", label: "Wróć do Biblioteki", target: "biblioteka", icon: "ChevronLeft" }
      ]
    }
  },
  items: {
    telefon:         { name: "Smartfon Ofiary",       desc: "Zablokowany 4-cyfrowym kodem PIN.",              icon: "Smartphone" },
    latarka_uv_pusta:{ name: "Latarka UV (Pusta)",    desc: "Wymaga baterii AA.",                             icon: "Flashlight" },
    baterie:         { name: "Baterie AA",            desc: "Dwie sztuki, wyglądają na nowe.",                icon: "Battery" },
    latarka_uv:      { name: "Latarka UV (Działa)",   desc: "Ujawnia niewidoczne ślady.",                     icon: "Zap" },
    srubokret:       { name: "Śrubokręt",            desc: "Płaski, ze śladami farby.",                      icon: "PenTool" },
    klucz_szopa:     { name: "Brudny Klucz",          desc: "Znaleziony w ogrodzie.",                         icon: "Key" },
    bilet:           { name: "Bilet do Selk",         desc: "Bilet lotniczy na nazwisko lorda Blackwooda.",   icon: "Ticket" },
    zdjecie_1:       { name: "Zdjęcie (Lewa)",        desc: "Fragment fotografii.",                           icon: "ImageIcon" },
    zdjecie_2:       { name: "Zdjęcie (Prawa)",       desc: "Fragment fotografii.",                           icon: "ImageIcon" },
    zdjecie_pelne:   { name: "Zdjęcie Ogrodnika",     desc: "Ogrodnik trzyma narzędzie zbrodni na stacji.",   icon: "Camera" },
    pamietnik:       { name: "Pamiętnik Lorda",       desc: "Notatki o długach hazardowych ogrodnika.",       icon: "BookOpen" },
    klucz_ukryty:    { name: "Ozdobny Klucz",         desc: "Mały, mosiężny klucz z herbem rodu.",           icon: "Key" },
    list_grozy:      { name: "List z Groźbami",       desc: "\"Zapłacisz za to. Wiem gdzie mieszkasz.\"",    icon: "FileText" },
    kartka_pin:      { name: "Kartka z Cyframi",      desc: "Pożółkła kartka: \"M pamiętaj: 1984\".",        icon: "FileText" },
    mapa_tras:       { name: "Mapa Ucieczki",         desc: "Zaznaczona trasa: Blackwood → Selk (Niemcy).",  icon: "Map" },
    zeznanie_marthy: { name: "Zeznanie Marthy",       desc: "\"Widziałam ogrodnika z łopatą o 22:00.\"",     icon: "FileText" }
  },
  victoryText: "Zadzwoniłeś na policję, prezentując niezbite dowody: zrekonstruowane zdjęcie ogrodnika z narzędziem zbrodni, zeznania pokojówki Marthy oraz groźby z listu. Motyw był jasny — ogrodnik dowiedział się, że lord Blackwood planuje uciec do Selk bez spłacenia długów. Dzięki Tobie zabójca został schwytany na stacji kolejowej."
};
