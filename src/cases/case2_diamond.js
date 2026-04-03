// Case 2: Zaginiony Diament Maharadży
export const case2 = {
  id: "diamond",
  title: "Zaginiony Diament",
  subtitle: "Kradzież w Muzeum Narodowym",
  difficulty: "★★★",
  estimate: "~20 min",
  startingRoom: "hall_muzeum",
  rooms: {
    hall_muzeum: {
      name: "Hol Muzeum",
      description: "Marmurowe kolumny wznoszą się ku sufitowi pokrytemu freskami. Alarm został wyłączony dokładnie o 3:17 w nocy. Ochroniarz Kowalski twierdzi, że niczego nie słyszał. Na podłodze widać delikatne zadrapania.",
      nodes: [
        { id: "idz_galeria", label: "Galeria Klejnotów", target: "galeria", icon: "DoorClosed" },
        { id: "idz_biuro", label: "Biuro Dyrektora", target: "biuro_dyrektora", icon: "DoorClosed" },
        { id: "idz_piwnica_m", label: "Pomieszczenie Techniczne", target: "tech_room", icon: "ChevronLeft" },
        { id: "rozmowa_ochroniarz", label: "Porozmawiaj z Ochroniarzem", action: "talk_guard", icon: "AlertCircle" },
        { id: "zadrapania", label: "Zbadaj Zadrapania", action: "examine_scratches", icon: "Search" },
        { id: "zakonczenie", label: "Wskaż Złodzieja", action: "ending_check", icon: "AlertCircle" }
      ]
    },
    galeria: {
      name: "Galeria Klejnotów",
      description: "Ekskluzywna sala wystawowa. Gablota z diamentem Maharadży jest rozbita — szkło leży na podłodze. Kamery zostały wyłączone. Na podłodze widać drobne włókna tkaniny.",
      nodes: [
        { id: "gablota", label: "Rozbita Gablota", action: "examine_display", icon: "Search" },
        { id: "kamery", label: "System Kamer", action: "examine_cameras", icon: "Settings" },
        { id: "wlokna", label: "Włókna na Podłodze", action: "examine_fibers", icon: "Search" },
        { id: "okno_galeria", label: "Okno Galerii", action: "examine_gallery_window", icon: "Search" },
        { id: "powrot_hall_g", label: "Wróć do Holu", target: "hall_muzeum", icon: "ChevronLeft" }
      ]
    },
    biuro_dyrektora: {
      name: "Biuro Dyrektora",
      description: "Eleganckie biuro. Dyrektor Nowak jest wyraźnie zdenerwowany — pije już trzecią kawę. Na biurku leży polisa ubezpieczeniowa, a w koszu na śmieci widać podarte papiery.",
      nodes: [
        { id: "rozmowa_dyrektor", label: "Porozmawiaj z Dyrektorem", action: "talk_director", icon: "AlertCircle" },
        { id: "polisa", label: "Polisa Ubezpieczeniowa", action: "examine_policy", icon: "FileText" },
        { id: "kosz", label: "Kosz na Śmieci", action: "examine_trash", icon: "Search" },
        { id: "szuflada", label: "Zamknięta Szuflada", action: "examine_drawer", icon: "Lock" },
        { id: "powrot_hall_b", label: "Wróć do Holu", target: "hall_muzeum", icon: "ChevronLeft" }
      ]
    },
    tech_room: {
      name: "Pomieszczenie Techniczne",
      description: "Serce systemu bezpieczeństwa muzeum. Monitory pokazują pętlę nagrań. Panel sterowania alarmem jest otwarty, kable odłączone. Na podłodze leży odcisk buta w smole.",
      nodes: [
        { id: "panel_alarm", label: "Panel Alarmu", action: "examine_alarm_panel", icon: "Settings" },
        { id: "monitory", label: "Monitory CCTV", action: "examine_monitors", icon: "Search" },
        { id: "odcisk_buta", label: "Odcisk Buta", action: "examine_bootprint", icon: "Footprints" },
        { id: "szafka_tech", label: "Szafka na Narzędzia", action: "examine_tool_cabinet", icon: "Search" },
        { id: "powrot_hall_t", label: "Wróć do Holu", target: "hall_muzeum", icon: "ChevronLeft" }
      ]
    }
  },
  items: {
    wlokna:          { name: "Włókna Tkaniny",        desc: "Ciemnoniebieski jedwab. Drogi materiał.",       icon: "Search" },
    odcisk:          { name: "Zdjęcie Odcisku Buta",  desc: "Rozmiar 43. Buty robocze marki ProStep.",        icon: "Camera" },
    polisa_dok:      { name: "Polisa Ubezpieczeniowa", desc: "Diament ubezpieczony na 5 mln. Beneficjent: Nowak.", icon: "FileText" },
    email_wydruk:    { name: "Wydrukowany Email",     desc: "\"Termin mija w piątek. Muszę mieć pieniądze.\"", icon: "FileText" },
    klucz_szuflady:  { name: "Mały Klucz",            desc: "Znaleziony w szafce technicznej.",               icon: "Key" },
    karta_dostepu:   { name: "Karta Dostępu",         desc: "Karta ochroniarza. Użyta o 3:15.",               icon: "Key" },
    notatka_guard:   { name: "Notatka Ochroniarza",   desc: "\"Dyrektor kazał mi wyłączyć alarm na 10 min.\"", icon: "FileText" },
    plan_muzeum:     { name: "Plan Budynku",          desc: "Zaznaczone przejście techniczne do galerii.",      icon: "Map" },
    rekawiczka:      { name: "Jedwabna Rękawiczka",   desc: "Ciemnoniebieska. Pasuje do włókien.",            icon: "Search" },
    zeznanie_guard:  { name: "Zeznanie Ochroniarza",  desc: "\"Dyrektor sam mnie prosił o wyłączenie alarmu.\"", icon: "FileText" }
  },
  victoryText: "Sprawa rozwiązana! Dyrektor Nowak zorganizował pozorowaną kradzież diamentu Maharadży. Zmuszony rosnącymi długami, przekonał ochroniarza Kowalskiego do wyłączenia alarmu, sam ukradł klejnot, a następnie chciał wyłudzić 5 milionów z ubezpieczenia. Jedwabne rękawiczki, które nosił, zostawiły charakterystyczne włókna. Jego własna karta dostępu zdradziła go w logach systemu. Doskonała robota, detektywie!"
};
