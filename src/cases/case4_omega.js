// Case 4: Dokument Omega - Szpiegostwo w Ministerstwie
export const case4 = {
  id: "omega",
  title: "Dokument Omega",
  subtitle: "Szpiegostwo i zdrada w Ministerstwie Obrony",
  difficulty: "★★★★★",
  estimate: "~40 min",
  startingRoom: "recepcja",
  rooms: {
    recepcja: {
      name: "Recepcja Ministerstwa",
      description: "Sterylna recepcja Ministerstwa Obrony. Portrety generałów na ścianach. Strażnik przy drzwiach wygląda na zdenerwowanego. Za biurkiem recepcji siedzi sekretarka Nowacka, przeglądając swój telefon. Na ladzie leży raportu wejść i wyjść z ostatnich 24h.",
      nodes: [
        { id: "idz_gabinet_min", label: "Gabinet Ministra", target: "gabinet_ministra", icon: "DoorClosed" },
        { id: "idz_archiwum", label: "Archiwum Poufne", target: "archiwum", icon: "Lock" },
        { id: "idz_serwerownia", label: "Serwerownia", target: "serwerownia", icon: "DoorClosed" },
        { id: "idz_straznik", label: "Pokój Ochrony", target: "pokoj_ochrony", icon: "DoorClosed" },
        { id: "idz_parking", label: "Parking Podziemny", target: "parking", icon: "ChevronLeft" },
        { id: "idz_kancelaria", label: "Kancelaria Tajna", target: "kancelaria", icon: "Lock" },
        { id: "raport_wejsc", label: "Raport Wejść/Wyjść", action: "examine_access_log", icon: "FileText" },
        { id: "rozmowa_sekretarka", label: "Porozmawiaj z Nowacką", action: "talk_secretary", icon: "AlertCircle" },
        { id: "zakonczenie4", label: "Wskaż Zdrajcę", action: "ending_check", icon: "AlertCircle" }
      ]
    },
    gabinet_ministra: {
      name: "Gabinet Ministra",
      description: "Imponujący gabinet z dębowym biurkiem. Minister Dąbrowski wygląda na wstrząśniętego. 'Dokument Omega opisuje rozmieszczenie naszych baz. Jeśli wycieknie, to katastrofa.' Na biurku stosy papierów, a na podłodze leży pęknięta filiżanka.",
      nodes: [
        { id: "rozmowa_minister", label: "Porozmawiaj z Ministrem", action: "talk_minister", icon: "AlertCircle" },
        { id: "biurko_ministra", label: "Przeszukaj Biurko", action: "search_minister_desk", icon: "Search" },
        { id: "filizanka_min", label: "Pęknięta Filiżanka", action: "examine_broken_cup", icon: "Search" },
        { id: "sejf_ministra", label: "Sejf w Ścianie", action: "open_minister_safe", icon: "Lock" },
        { id: "okno_gabinetu", label: "Okno Gabinetu", action: "examine_office_window", icon: "Search" },
        { id: "powrot_rec_g", label: "Wróć do Recepcji", target: "recepcja", icon: "ChevronLeft" }
      ]
    },
    archiwum: {
      name: "Archiwum Poufne",
      description: "Rzędy metalowych regałów z segregatorami. Światło mruga. Teczka 'OMEGA' powinna być w szufladzie D-7, ale jest pusta. Na podłodze leży guzik od munduru. Kamera w rogu sali jest odwrócona.",
      nodes: [
        { id: "szuflada_d7", label: "Szuflada D-7", action: "examine_drawer_d7", icon: "Search" },
        { id: "guzik", label: "Guzik z Munduru", action: "examine_button", icon: "Search" },
        { id: "kamera_archiwum", label: "Odwrócona Kamera", action: "examine_archive_camera", icon: "Camera" },
        { id: "terminal_archiwum", label: "Terminal Dostępu", action: "examine_terminal", icon: "Settings" },
        { id: "alternatywne_wejscie", label: "Wentylacja", action: "examine_archive_vent", icon: "Search" },
        { id: "powrot_rec_a", label: "Wróć do Recepcji", target: "recepcja", icon: "ChevronLeft" }
      ]
    },
    serwerownia: {
      name: "Serwerownia",
      description: "Chłodna sala pełna serwerów. Kumar, administrator IT, pracuje przy konsoli. Na jednym ze stanowisk jest otwarty terminal z logami transferu danych. Kabel USB zwisa z jednego z portów.",
      nodes: [
        { id: "rozmowa_kumar", label: "Porozmawiaj z Kumarem", action: "talk_kumar", icon: "AlertCircle" },
        { id: "logi_transferu", label: "Logi Transferu Danych", action: "examine_transfer_logs", icon: "FileText" },
        { id: "kabel_usb", label: "Kabel USB", action: "examine_usb", icon: "Search" },
        { id: "backup_serwer", label: "Serwer Backupów", action: "examine_backup", icon: "Settings" },
        { id: "powrot_rec_s", label: "Wróć do Recepcji", target: "recepcja", icon: "ChevronLeft" }
      ]
    },
    pokoj_ochrony: {
      name: "Pokój Ochrony",
      description: "Ekrany monitoringu, dwa biurka. Ochroniarz Wojciechowski je kanapkę, udając spokój. Na tablicy wiszą grafiki dyżurów. W szufladzie biurka jest drugi telefon — prywatny.",
      nodes: [
        { id: "rozmowa_ochroniarz", label: "Porozmawiaj z Wojciechowskim", action: "talk_guard_omega", icon: "AlertCircle" },
        { id: "monitoring", label: "Nagrania z Monitoringu", action: "examine_cctv_omega", icon: "Camera" },
        { id: "grafik", label: "Grafik Dyżurów", action: "examine_schedule", icon: "FileText" },
        { id: "szuflada_ochrony", label: "Szuflada Biurka", action: "search_guard_desk", icon: "Search" },
        { id: "powrot_rec_o", label: "Wróć do Recepcji", target: "recepcja", icon: "ChevronLeft" }
      ]
    },
    parking: {
      name: "Parking Podziemny",
      description: "Ciemny, betonowy parking. Wentyulacja huczy. Samochód ochroniarza Wojciechowskiego stoi pod ścianą — bagażnik niedomknięty. Przy windzie leży niedopałek papierosa zagranicznej marki.",
      nodes: [
        { id: "samochod", label: "Samochód Wojciechowskiego", action: "examine_guard_car", icon: "Search" },
        { id: "niedopalek", label: "Niedopałek Papierosa", action: "examine_cigarette", icon: "Search" },
        { id: "kamera_parking", label: "Kamera na Parkingu", action: "examine_parking_camera", icon: "Camera" },
        { id: "smietnik_parking", label: "Kosz na śmieci", action: "examine_parking_trash", icon: "Search" },
        { id: "powrot_rec_p", label: "Wróć do Recepcji", target: "recepcja", icon: "ChevronLeft" }
      ]
    },
    kancelaria: {
      name: "Kancelaria Tajna",
      description: "Pancerne drzwi. Wewnątrz — segregatory z najwyższą klauzulą. Pułkownik Zieliński, szef kancelarii, stoi z rękami w kieszeniach. Na biurku leży dziennik korespondencji. Kopiarka w rogu jest ciepła — ktoś niedawno kopiował.",
      nodes: [
        { id: "rozmowa_pulkownik", label: "Porozmawiaj z Pułkownikiem", action: "talk_colonel", icon: "AlertCircle" },
        { id: "dziennik", label: "Dziennik Korespondencji", action: "examine_correspondence", icon: "FileText" },
        { id: "kopiarka", label: "Kopiarka", action: "examine_copier", icon: "Search" },
        { id: "szafa_tajna", label: "Szafa z Dokumentami", action: "examine_classified_cabinet", icon: "Lock" },
        { id: "powrot_rec_k", label: "Wróć do Recepcji", target: "recepcja", icon: "ChevronLeft" }
      ]
    }
  },
  items: {
    raport_wejsc:    { name: "Raport Dostępu",        desc: "Wojciechowski: wejście 22:00, wyjście 4:30. Zieliński: 23:15-2:00.",  icon: "FileText" },
    guzik_munduru:   { name: "Guzik z Munduru",        desc: "Guzik od munduru ochrony. Wyrwany siłą.",                            icon: "Search" },
    pendrive:        { name: "Pendrive (Zaszyfrowany)", desc: "8GB. Zaszyfrowany. Znaleziony w serwerowni.",                        icon: "Key" },
    logi_dane:       { name: "Logi Transferu",         desc: "O 1:17 skopiowano 340MB na USB. Terminal: KANCELARIA-01.",            icon: "FileText" },
    zdjecie_cctv:    { name: "Zdjęcie z CCTV",         desc: "Sylwetka mężczyzny w korytarzu archiwum o 1:15. Mundur ochrony.",     icon: "Camera" },
    telefon_burner:  { name: "Drugi Telefon",          desc: "Prepaid. SMS: \"Paczka gotowa. Miejsce jak zwykle. — K.\"",           icon: "Smartphone" },
    klucz_archiwum:  { name: "Klucz do Archiwum",      desc: "Kopia klucza, nie z oficjalnego zestawu.",                            icon: "Key" },
    grafik_dok:      { name: "Grafik Dyżurów",         desc: "Wojciechowski miał dyżur nocny sam — bez drugiej zmiany.",            icon: "FileText" },
    papieros_obcy:   { name: "Niedopałek Papierosa",   desc: "Marka \"Sobranie\". Nikt w biurze ich nie pali.",                     icon: "Search" },
    koperta_parking: { name: "Koperta z Złotówkami",    desc: "Gruba koperta: 50 000 zł w banknotach 500-złotowych.",               icon: "FileText" },
    kopia_omega:     { name: "Częściowa Kopia Omega",   desc: "Strony 12-18 dokumentu Omega. Ktoś kopiował pospiesznie.",           icon: "FileText" },
    dziennik_wpis:   { name: "Wpis z Dziennika",       desc: "Omega wypożyczona o 23:30 na nazwisko Zielińskiego.",                 icon: "FileText" },
    notatka_kumar:   { name: "Notatka Kumara",         desc: "\"Transfer z KANCELARIA-01 nieautoryzowany. Zgłosić?\"",              icon: "FileText" },
    odcisk_buta_o:   { name: "Odcisk Buta (Parking)",  desc: "Rozmiar 45. Buty służbowe ochrony.",                                  icon: "Footprints" },
    zeznanie_kumara: { name: "Zeznanie Kumara",        desc: "\"Pułkownik prosił o hasło admina. Dałem, bo to mój przełożony.\"",   icon: "FileText" },
    zeznanie_sekr:   { name: "Zeznanie Nowackiej",     desc: "\"Pułkownik wychodził z teczką o 2:00. Mówił, że to rutyna.\"",       icon: "FileText" }
  },
  victoryText: "Sprawa Omega rozwiązana! Pułkownik Zieliński, szef Kancelarii Tajnej, sprzedawał tajne dokumenty obcemu wywiadowi. Wykorzystał swój dostęp, by skopiować Dokument Omega, a następnie przekazał go za pośrednictwem ochroniarza Wojciechowskiego, którego przekupił 50 000 zł. Pułkownik użył hasła admina, by zatrzeć ślady w logach, ale logi transferu i nagrania z CCTV okazały się decydujące. Wojciechowski złożył zeznania w zamian za łagodniejszy wyrok. Zdrajca został aresztowany o świcie. Ojczyzna jest Ci wdzięczna, detektywie."
};
