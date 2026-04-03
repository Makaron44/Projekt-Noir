import { useState, useCallback, useMemo, useRef } from 'react';
import { playDoorSound, playDiscoverySound, playTypewriterClick, playErrorSound, playSuccessSound } from '../sounds.js';

export const useGame = (caseData) => {
  const [currentRoomId, setCurrentRoomId] = useState(caseData.startingRoom);
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState(['Rozpoczynasz śledztwo. Zbierz dowody i wskaż winnego.']);
  const [flags, setFlags] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCodepad, setShowCodepad] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [steps, setSteps] = useState(0);
  const startTime = useRef(Date.now());

  const currentRoom = useMemo(() => caseData.rooms[currentRoomId], [currentRoomId, caseData]);

  const addLog = useCallback((text) => {
    playTypewriterClick();
    setSteps(s => s + 1);
    setLogs(prev => [text, ...prev].slice(0, 15));
  }, []);

  const handleMove = useCallback((targetId) => {
    if (caseData.rooms[targetId]) {
      playDoorSound();
      setCurrentRoomId(targetId);
      setSelectedItem(null);
      addLog(`Przechodzisz do: ${caseData.rooms[targetId].name}`);
    }
  }, [addLog, caseData]);

  const addToInventory = useCallback((itemKey) => {
    setInventory(prev => {
      if (prev.includes(itemKey)) return prev;
      playDiscoverySound();
      return [...prev, itemKey];
    });
  }, []);

  const getFlag = useCallback((key) => flags[key] || false, [flags]);
  const setFlag = useCallback((key, val = true) => {
    setFlags(f => ({ ...f, [key]: val }));
  }, []);

  const handleCodeSubmit = useCallback((type, code) => {
    // Case 1: Blackwood
    if (caseData.id === 'blackwood') {
      if (type === 'safe' && code === '1892') {
        playSuccessSound();
        setFlag('safeOpened');
        addToInventory('zdjecie_1');
        addLog('Klik! Sejf się otworzył. W środku leżał podarty kawałek zdjęcia.');
        setShowCodepad(null);
        return true;
      }
      if (type === 'phone' && code === '1984') {
        playSuccessSound();
        setFlag('phoneUnlocked');
        addLog('Telefon odblokowany! Wiadomości od "O": groźby wobec lorda.');
        setShowCodepad(null);
        return true;
      }
    }
    // Case 2: Diamond
    if (caseData.id === 'diamond') {
      if (type === 'drawer' && code === '2137') {
        playSuccessSound();
        setFlag('drawerOpen');
        addToInventory('email_wydruk');
        addLog('Szuflada otwarta! W środku wydrukowany email o długach dyrektora.');
        setShowCodepad(null);
        return true;
      }
    }
    // Case 4: Omega
    if (caseData.id === 'omega') {
      if (type === 'min_safe' && code === '4471') {
        playSuccessSound();
        setFlag('minSafeOpen');
        addLog('Sejf ministra otwarty! W środku: notatka "Zieliński prosi o dostęp do sekcji D — ODMÓWIONO." Minister mu nie ufał!');
        setShowCodepad(null);
        return true;
      }
    }
    playErrorSound();
    addLog('Błędny kod.');
    return false;
  }, [caseData, addLog, addToInventory, setFlag]);


  const handleAction = useCallback((action) => {
    // =============================================
    // CASE 1: BLACKWOOD actions
    // =============================================
    if (caseData.id === 'blackwood') {
      switch (action) {
        case 'examine_body':
          if (!getFlag('foundBody')) { setFlag('foundBody'); addToInventory('bilet'); addLog('Lord Blackwood nie żyje. Rana na tyle głowy. W kieszeni zmięty bilet lotniczy.'); }
          else addLog('Ofiara zmarła od uderzenia ciężkim narzędziem.');
          break;
        case 'examine_desk':
          if (!inventory.includes('telefon')) { addToInventory('telefon'); addToInventory('latarka_uv_pusta'); addLog('W biurku: zablokowany smartfon i stara latarka UV bez baterii.'); }
          else addLog('Biurko jest puste.');
          break;
        case 'open_safe':
          if (getFlag('safeOpened')) addLog('Sejf jest otwarty i pusty.');
          else setShowCodepad('safe');
          break;
        case 'examine_vent':
          if (getFlag('ventOpen')) addLog('Kratka jest otwarta. Pusto.');
          else if (selectedItem === 'srubokret') { setFlag('ventOpen'); addToInventory('baterie'); setSelectedItem(null); addLog('Odkręcasz kratkę. Wewnątrz: baterie!'); }
          else addLog('Kratka przykręcona na śruby. Potrzebujesz narzędzia.');
          break;
        case 'examine_books':
          if (selectedItem === 'latarka_uv') { setFlag('uvRevealed'); setSelectedItem(null); addLog('UV ujawnia napis: "SEJF: 1892". To kod!'); }
          else if (getFlag('uvRevealed')) addLog('Kod do sejfu to 1892.');
          else addLog('Tysiące książek. Bez specjalnego sprzętu nic nie znajdziesz.');
          break;
        case 'examine_reading_desk':
          if (!inventory.includes('pamietnik')) { addToInventory('pamietnik'); addLog('Pamiętnik lorda! Pisze o hazardowych długach ogrodnika.'); }
          else addLog('Nic nowego.');
          break;
        case 'hidden_passage':
          if (getFlag('passageFound')) handleMove('ukryty_pokoj');
          else if (selectedItem === 'latarka_uv') { setFlag('passageFound'); setSelectedItem(null); playSuccessSound(); addLog('Latarka UV ujawnia mechanizm! Ściana się otwiera!'); }
          else addLog('Podejrzana ściana. Może specjalne oświetlenie pomoże…');
          break;
        case 'examine_escape_map':
          if (!inventory.includes('mapa_tras')) { addToInventory('mapa_tras'); addLog('Mapa ucieczki: Blackwood → Selk (Niemcy).'); }
          else addLog('Trasa prowadzi do Selk.');
          break;
        case 'examine_hidden_letter':
          if (!inventory.includes('list_grozy')) { addToInventory('list_grozy'); addLog('List z groźbami!: "Zapłacisz za to." Podpis: "O" — Ogrodnik!'); }
          else addLog('List z groźbami od ogrodnika.');
          break;
        case 'examine_path':
          if (!inventory.includes('klucz_szopa')) { addToInventory('klucz_szopa'); addLog('W błocie: brudny klucz!'); }
          else addLog('Ślady stóp prowadzą do szopy.');
          break;
        case 'enter_shed':
          if (getFlag('shedUnlocked')) addLog('Szopa jest otwarta. Zapach krwi.');
          else if (selectedItem === 'klucz_szopa') { setFlag('shedUnlocked'); addToInventory('zdjecie_2'); addToInventory('srubokret'); setSelectedItem(null); addLog('Szopa otwarta! Druga połowa zdjęcia i śrubokręt.'); }
          else addLog('Masywna kłódka. Potrzebujesz klucza.');
          break;
        case 'examine_bench':
          if (!getFlag('benchSearched')) { setFlag('benchSearched'); addToInventory('klucz_ukryty'); addLog('Pod ławką: mosiężny klucz z herbem rodu.'); }
          else addLog('Pod ławką pusto.');
          break;
        case 'examine_cellar_wall':
          if (selectedItem === 'latarka_uv') { setFlag('cellarWritingSeen'); setSelectedItem(null); addLog('UV oświetla: "M pamiętaj: 1984". To PIN!'); }
          else if (getFlag('cellarWritingSeen')) addLog('Napis: "M pamiętaj: 1984".');
          else addLog('Zdrapana farba. Pod spodem coś jest, ale nie widać gołym okiem.');
          break;
        case 'examine_crate':
          if (!getFlag('crateOpened')) { setFlag('crateOpened'); addToInventory('kartka_pin'); addLog('W skrzynce: kartka "M pamiętaj: 1984". PIN do telefonu!'); }
          else addLog('Pusta skrzynka.');
          break;
        case 'talk_martha':
          if (!getFlag('marthaSpoke')) { setFlag('marthaSpoke'); addLog('Martha: "Słyszałam kłótnię o 21:00. Pan krzyczał na ogrodnika."'); }
          else if (inventory.includes('list_grozy') && !getFlag('marthaFullTruth')) { setFlag('marthaFullTruth'); addToInventory('zeznanie_marthy'); addLog('Pokazujesz list. Martha: "Widziałam ogrodnika z łopatą o 22:00!"'); }
          else if (getFlag('marthaFullTruth')) addLog('Martha powiedziała już wszystko.');
          else addLog('Martha milczy. Może jakiś dowód ją przekona…');
          break;
        case 'examine_cup':
          if (!getFlag('cupExamined')) { setFlag('cupExamined'); addLog('Na spodku filiżanki: "ON WIE".'); }
          else addLog('"ON WIE" na spodku.');
          break;
        case 'examine_servant_cabinet':
          if (getFlag('cabinetOpen')) addLog('Szafka pusta.');
          else if (selectedItem === 'klucz_ukryty') { setFlag('cabinetOpen'); setSelectedItem(null); addLog('Mosiężny klucz pasuje! W szafce ukryty list z groźbami.'); if (!inventory.includes('list_grozy')) addToInventory('list_grozy'); }
          else addLog('Szafka zamknięta. Potrzeba klucza.');
          break;
        case 'ending_check': {
          const hasPhoto = inventory.includes('zdjecie_pelne');
          const hasTestimony = inventory.includes('zeznanie_marthy') || getFlag('phoneUnlocked');
          const hasMotive = inventory.includes('pamietnik') || inventory.includes('list_grozy');
          if (hasPhoto && hasTestimony && hasMotive) { playSuccessSound(); setGameWon(true); }
          else { const m = []; if (!hasPhoto) m.push('dowód rzeczowy'); if (!hasTestimony) m.push('zeznanie świadka'); if (!hasMotive) m.push('motyw'); addLog(`Brakuje: ${m.join(', ')}. Szukaj dalej!`); }
          break;
        }
        default: addLog('Nic się nie dzieje.');
      }
    }
    // =============================================
    // CASE 2: DIAMOND actions
    // =============================================
    else if (caseData.id === 'diamond') {
      switch (action) {
        case 'talk_guard':
          if (!getFlag('guardTalked')) { setFlag('guardTalked'); addLog('Ochroniarz Kowalski: "Byłem na obchodzie. Niczego nie słyszałem."'); }
          else if (inventory.includes('karta_dostepu') && !getFlag('guardConfessed')) { setFlag('guardConfessed'); addToInventory('zeznanie_guard'); addLog('Pokazujesz kartę dostępu. Kowalski blady: "Dobrze... dyrektor sam mnie prosił o wyłączenie alarmu na 10 min."'); }
          else if (getFlag('guardConfessed')) addLog('Kowalski zeznał już wszystko.');
          else addLog('Kowalski jest nerwowy. Może jakiś dowód go złamie…');
          break;
        case 'examine_scratches':
          if (!getFlag('scratchesSeen')) { setFlag('scratchesSeen'); addLog('Zadrapania na marmurze — ktoś przesuwał ciężką gablotę. Ślady prowadzą do pomieszczenia technicznego.'); }
          else addLog('Zadrapania prowadzą do pomieszczenia technicznego.');
          break;
        case 'examine_display':
          if (!getFlag('displayExamined')) { setFlag('displayExamined'); addLog('Gablota rozbita od wewnątrz — nie od zewnątrz! Ktoś miał klucz do gabloty i symulował włamanie.'); }
          else addLog('Gablota rozbita od środka. Symulowane włamanie.');
          break;
        case 'examine_cameras':
          if (!getFlag('camerasChecked')) { setFlag('camerasChecked'); addLog('Kamery wyłączone z poziomu panelu sterowania o 3:15. Potrzebna karta dostępu.'); }
          else addLog('Kamery wyłączone o 3:15.');
          break;
        case 'examine_fibers':
          if (!inventory.includes('wlokna')) { addToInventory('wlokna'); addLog('Ciemnoniebieskie włókna jedwabiu. Drogie — takie noszą ludzie z klasy wyższej, nie złodzieje.'); }
          else addLog('Włókna jedwabiu. Drogi materiał.');
          break;
        case 'examine_gallery_window':
          if (!getFlag('windowChecked')) { setFlag('windowChecked'); addLog('Okno nietknięte! Zamknięte od wewnątrz. Złodziej wyszedł tym samym wejściem co wszedł.'); }
          else addLog('Okno zamknięte od środka. Nikt tędy nie uciekał.');
          break;
        case 'talk_director':
          if (!getFlag('directorTalked')) { setFlag('directorTalked'); addLog('Dyrektor Nowak: "Najcenniejszy eksponat! To katastrofa! Muszę zadzwonić do ubezpieczalni." Dziwnie się śpieszy z ubezpieczeniem...'); }
          else if (inventory.includes('email_wydruk') && !getFlag('directorCaught')) { setFlag('directorCaught'); addLog('Pokazujesz email o długach. Nowak: "To... to nie tak jak myślisz. Miałem problemy, ale..."'); }
          else addLog('Dyrektor Nowak pije kawę i nic nie mówi.');
          break;
        case 'examine_policy':
          if (!inventory.includes('polisa_dok')) { addToInventory('polisa_dok'); addLog('Polisa: diament ubezpieczony na 5 mln złotych. Beneficjent: Dyrektor Nowak osobiście! Bardzo podejrzane.'); }
          else addLog('Polisa na 5 mln. Beneficjent: Nowak.');
          break;
        case 'examine_trash':
          if (!getFlag('trashSearched')) { setFlag('trashSearched'); addToInventory('rekawiczka'); addLog('W koszu: ciemnoniebieska jedwabna rękawiczka! Pasuje do włókien z galerii.'); }
          else addLog('W koszu nic więcej.');
          break;
        case 'examine_drawer':
          if (getFlag('drawerOpen')) addLog('Szuflada pusta.');
          else if (inventory.includes('klucz_szuflady')) { setShowCodepad('drawer'); }
          else addLog('Szuflada zamknięta na kluczyk i szyfr. Potrzebujesz klucza i kodu.');
          break;
        case 'examine_alarm_panel':
          if (!getFlag('alarmChecked')) { setFlag('alarmChecked'); addToInventory('karta_dostepu'); addLog('Panel otwarty fachowo. W slocie: karta dostępu ochroniarza Kowalskiego. Użyta o 3:15.'); }
          else addLog('Panel wyłączony kartą Kowalskiego o 3:15.');
          break;
        case 'examine_monitors':
          if (!getFlag('monitorsChecked')) { setFlag('monitorsChecked'); addLog('Nagrania w pętli od 3:15 do 3:40. Ktoś wgrał starszy materiał. Profesjonalna robota.'); }
          else addLog('25-minutowa pętla. Profesjonalne.');
          break;
        case 'examine_bootprint':
          if (!inventory.includes('odcisk')) { addToInventory('odcisk'); addLog('Odcisk buta roboczego rozm. 43 w smole. Ochroniarz nosi 46, dyrektor...? Trzeba sprawdzić.'); }
          else addLog('Odcisk buta rozm. 43.');
          break;
        case 'examine_tool_cabinet':
          if (!getFlag('toolCabinet')) { setFlag('toolCabinet'); addToInventory('klucz_szuflady'); addToInventory('plan_muzeum'); addLog('W szafce: mały kluczyk i plan budynku z zaznaczonym tajnym przejściem do galerii. Na planie notatka: "2137".'); }
          else addLog('Szafka pusta.');
          break;
        case 'ending_check': {
          const hasInsurance = inventory.includes('polisa_dok');
          const hasGlove = inventory.includes('rekawiczka');
          const hasTestimony = inventory.includes('zeznanie_guard') || getFlag('directorCaught');
          if (hasInsurance && hasGlove && hasTestimony) { playSuccessSound(); setGameWon(true); }
          else { const m = []; if (!hasInsurance) m.push('motyw finansowy'); if (!hasGlove) m.push('dowód fizyczny'); if (!hasTestimony) m.push('zeznanie lub przyznanie'); addLog(`Brakuje: ${m.join(', ')}. Szukaj dalej!`); }
          break;
        }
        default: addLog('Nic się nie dzieje.');
      }
    }
    // =============================================
    // CASE 3: OPERA actions
    // =============================================
    else if (caseData.id === 'opera') {
      switch (action) {
        case 'examine_program':
          if (!inventory.includes('program')) { addToInventory('program'); addLog('Program: Gwiazda — Elżbieta Stern. Dublerka — Anna Kowalczyk. Reżyser — Malinowski. Na premierę przyszedł krytyk Zawadzki.'); }
          else addLog('Znasz już obsadę wieczoru.');
          break;
        case 'examine_goblet':
          if (!inventory.includes('kielich_dowod')) { addToInventory('kielich_dowod'); addLog('Kielich ze sceny! Na dnie widać osad. Stern piła z niego podczas II aktu. Trzeba to zbadać w laboratorium.'); }
          else addLog('Kielich zabezpieczony jako dowód.');
          break;
        case 'examine_flowers':
          if (!inventory.includes('bukiet_karta')) { addToInventory('bukiet_karta'); addLog('W bukiecie róż ukryta karteczka: "Twój ostatni występ. — R.Z." Groźba czy żart?'); }
          else addLog('Bukiet z karteczką od R.Z.');
          break;
        case 'examine_props_table':
          if (!getFlag('propsChecked')) { setFlag('propsChecked'); addLog('Stół z rekwizytami. Kielich nie jest rekwizytorem — ktoś go podmienił! Prawdziwy rekwizyt ma naklejkę, ten nie.'); }
          else addLog('Kielich na scenie był podmieniony.')
          break;
        case 'examine_dark_corner':
          if (!inventory.includes('fiolka')) { addToInventory('fiolka'); addLog('Za kurtyną: pusta fiolka z aptekarską etykietą "Aconitum — ekstrakt". Tojad to silna trucizna!'); }
          else addLog('Ciemny kąt. Tu znalazłeś fiolkę.');
          break;
        case 'talk_technician':
          if (!getFlag('techTalked')) { setFlag('techTalked'); addLog('Technik Paweł: "Ktoś wyłączył kamery za kulisami o 20:30. Ja tego nie robiłem. Widziałem mężczyznę w smokingu za kurtyną."'); }
          else if (inventory.includes('zapalniczka_rz') && !getFlag('techIdentified')) { setFlag('techIdentified'); addToInventory('zapis_kamer'); addLog('Pokazujesz zapalniczkę. Technik: "Tak! Ten mężczyzna ją miał! Znalazłem backup z kamery — mam zdjęcie!"'); }
          else addLog('Technik nie ma nic więcej do dodania.');
          break;
        case 'examine_vanity':
          if (!getFlag('vanityChecked')) { setFlag('vanityChecked'); addToInventory('notatka_trucizna'); addLog('Wśród kosmetyków: notatka na bibułce — "Aconitum: dawka śmiertelna 2mg. Działa w 30 min." Ktoś tu badał truciznę!'); }
          else addLog('Notatka o truciźnie pochodzi stąd.');
          break;
        case 'examine_wine':
          if (!getFlag('wineChecked')) { setFlag('wineChecked'); addLog('Butelka Chianti. Otwarta, ale nienaruszona. Etykieta: "Od admiratora". Trucizna nie była w winie, lecz w kielichu na scenie.'); }
          else addLog('Wino nieskażone. Trucizna była w kielichu.');
          break;
        case 'examine_suitcase':
          if (getFlag('suitcaseOpen')) addLog('Walizka otwarta. Bilety do Buenos Aires.');
          else if (inventory.includes('klucz_walizki')) { setFlag('suitcaseOpen'); setSelectedItem(null); addToInventory('bilet_lotniczy'); addLog('Walizka otwarta! W środku: 2 bilety lotnicze do Buenos Aires na nazwiska R. Zawadzki i E. Stern. Planowali ucieczkę?!'); }
          else addLog('Walizka zamknięta. Potrzeba kluczyka.');
          break;
        case 'examine_letters':
          if (!inventory.includes('list_milosny')) { addToInventory('list_milosny'); addLog('Liścik miłosny: "Kochana E., odejdź ze mną. Rzuć to wszystko. Tylko Ty i ja. — R." Kto to R?'); }
          else addLog('List miłosny od tajemniczego R.');
          break;
        case 'examine_mirror':
          if (selectedItem === 'fiolka') { setSelectedItem(null); setFlag('mirrorRevealed'); addLog('Pod lampką przy lustrze: odcisk palca na fiolce pasuje do tłustych śladów na lustrze. Ktoś się tu przygotowywał!'); }
          else if (!getFlag('mirrorChecked')) { setFlag('mirrorChecked'); addLog('Lustro otoczone żarówkami. Jedna nie świeci. Za nią nic nie ukryto.'); }
          else addLog('Lustro bez nowych śladów.');
          break;
        case 'talk_barman':
          if (!getFlag('barmanTalked')) { setFlag('barmanTalked'); addLog('Barman Jan: "Pan Zawadzki zamówił specjalne wino i SAM je zaniósł za kulisy o 20:35. Powiedział, że to prezent dla pani Stern."'); }
          else if (inventory.includes('fiolka') && !getFlag('barmanWitness')) { setFlag('barmanWitness'); addToInventory('zeznanie_barmana'); addLog('Pokazujesz fiolkę. Barman: "Zawadzki miał taką w kieszeni! Widziałem jak ją chował przed wyjściem na balkon!"'); }
          else addLog('Barman nie ma nic nowego.');
          break;
        case 'talk_critic':
          if (!getFlag('criticTalked')) { setFlag('criticTalked'); addLog('Krytyk Zawadzki (nerwowo): "Byłem na balkonie cały czas. Nie wychodziłem. Jestem KRYTYKIEM, oglądam przedstawienia, nie truję ludzi!"'); }
          else if (inventory.includes('bukiet_karta') && !getFlag('criticPressured')) { setFlag('criticPressured'); addLog('Pokazujesz kartkę z bukietu "R.Z." Zawadzki blednie: "To... to miał być żart. Artystyczna prowokacja. Nic więcej."'); }
          else if (inventory.includes('bilet_lotniczy') && !getFlag('criticBroken')) { setFlag('criticBroken'); addLog('Pokazujesz bilety do Buenos Aires. Zawadzki łamie się: "Dobrze! Kochałem ją! Ale ona NIE CHCIAŁA ze mną jechać! Odmówiła!"'); }
          else addLog('Zawadzki milczy wyzywająco.');
          break;
        case 'search_behind_bar':
          if (!inventory.includes('receptura')) { addToInventory('receptura'); addLog('Za barem, w koszu: paragon z apteki na "ekstrakt z tojadu". Podpis nieczytelny, ale data: dziś.'); }
          else addLog('Za barem pusto.');
          break;
        case 'examine_orders':
          if (!getFlag('ordersChecked')) { setFlag('ordersChecked'); addLog('Zamówienia: O 20:30 Zawadzki zamówił butelkę Chianti "do garderoby gwiazdy". Sam ją zaniósł.'); }
          else addLog('Zawadzki zamawiał wino o 20:30.');
          break;
        case 'talk_opera_director':
          if (!getFlag('operaDirTalked')) { setFlag('operaDirTalked'); addLog('Dyrektor Malinowski: "Stern chciała odejść! Pisała o zerwaniu kontraktu. Kowalczyk była gotowa przejąć rolę. Ale ja NIKOGO nie trułem!"'); }
          else if (!getFlag('operaDirContracts') && inventory.includes('kontrakt_dubler')) { setFlag('operaDirContracts'); addLog('Malinowski na widok kontraktu: "To rutynowa procedura! Każda gwiazda ma dublerkę z gotowym kontraktem!"'); }
          else addLog('Malinowski powtarza, że jest niewinny.');
          break;
        case 'examine_contracts':
          if (!inventory.includes('kontrakt_dubler')) { addToInventory('kontrakt_dubler'); addLog('Kontrakt dublerki Kowalczyk: "W przypadku niezdolności Stern, Kowalczyk przejmuje rolę I kontrakt." Podejrzane, ale standardowe?'); }
          else addLog('Kontrakt dublerki na biurku.');
          break;
        case 'examine_office_trash':
          if (!inventory.includes('list_szantaz')) { addToInventory('list_szantaz'); addLog('W koszu: podarty list! Sklejasz: "Wiem o fałszywej polisie ubezpieczeniowej. Zapłać albo pójdę na policję." Ktoś szantażował Malinowskiego!'); }
          else addLog('List szantażysty z kosza.');
          break;
        case 'examine_safe_opera':
          if (getFlag('operaSafeOpen')) addLog('Szafa pancerna pusta.');
          else { setFlag('operaSafeOpen'); addToInventory('polisa_opera'); addLog('Szafa uchylona! W środku: polisa na życie Stern. Ubezpieczona na 2 mln zł. Beneficjent: MĄŻ Rudolf Zawadzki! Są małżeństwem?!'); }
          break;
        case 'examine_binoculars':
          if (!getFlag('binocularsUsed')) { setFlag('binocularsUsed'); addLog('Lornetka skierowana na scenę, dokładnie na stół z rekwizytami. Ktoś obserwował kielich.'); }
          else addLog('Lornetka celowała w kielich na scenie.');
          break;
        case 'examine_lighter':
          if (!inventory.includes('zapalniczka_rz')) { addToInventory('zapalniczka_rz'); addLog('Złota zapalniczka. Monogram: R.Z. Rudolf Zawadzki? To krytyk! Był tu na balkonie.'); }
          else addLog('Zapalniczka R.Z.');
          break;
        case 'search_seat':
          if (!inventory.includes('klucz_walizki')) { addToInventory('klucz_walizki'); addLog('Między poduszkami fotela: mały srebrny kluczyk. Pasuje do walizki? Ktoś go tu ukrył.'); }
          else addLog('Między poduszkami pusto.');
          break;
        case 'ending_check': {
          const hasPoison = inventory.includes('fiolka') && inventory.includes('zeznanie_barmana');
          const hasTestimony = inventory.includes('zeznanie_barmana') || inventory.includes('zapis_kamer');
          const hasMotive = inventory.includes('polisa_opera') || inventory.includes('bilet_lotniczy');
          if (hasPoison && hasTestimony && hasMotive) { playSuccessSound(); setGameWon(true); }
          else { const m = []; if (!hasPoison) m.push('dowód trucizny + świadek'); if (!hasTestimony) m.push('identyfikacja sprawcy'); if (!hasMotive) m.push('motyw'); addLog(`Brakuje: ${m.join(', ')}. Szukaj dalej!`); }
          break;
        }
        default: addLog('Nic się nie dzieje.');
      }
    }
    // =============================================
    // CASE 4: OMEGA actions
    // =============================================
    else if (caseData.id === 'omega') {
      switch (action) {
        case 'examine_access_log':
          if (!inventory.includes('raport_wejsc')) { addToInventory('raport_wejsc'); addLog('Raport wejść: Wojciechowski (ochrona): 22:00-4:30. Pułkownik Zieliński: 23:15-2:00. Kumar (IT): 8:00-17:00 (wczoraj). Sekretarka: nie było jej w nocy.'); }
          else addLog('Raport: Wojciechowski i Zieliński byli w nocy.');
          break;
        case 'talk_secretary':
          if (!getFlag('secrTalked')) { setFlag('secrTalked'); addLog('Nowacka: "Ja tu nie byłam w nocy. Ale... widziałam pułkownika Zielińskiego wychodzącego z teczką o 2:00. Mówił, że to rutyna."'); }
          else if (inventory.includes('koperta_parking') && !getFlag('secrWitness')) { setFlag('secrWitness'); addToInventory('zeznanie_sekr'); addLog('Pokazujesz kopertę z pieniędzmi. Nowacka: "Boże... Pułkownik dał kiedyś taką kopertę Wojciechowskiemu. Widziałam przez szybę gabinetu."'); }
          else addLog('Nowacka nie wie nic poza tym co powiedziała.');
          break;
        case 'talk_minister':
          if (!getFlag('ministerTalked')) { setFlag('ministerTalked'); addLog('Minister Dąbrowski: "Dokument Omega to rozmieszczenie baz. Kategoria ŚCIŚLE TAJNE. Dostęp mieli: ja, Zieliński i Wojciechowski przy asyście. Kumar technicznie."'); }
          else addLog('Minister jest przerażony, ale nie ma nowych informacji.');
          break;
        case 'search_minister_desk':
          if (!getFlag('minDeskSearched')) { setFlag('minDeskSearched'); addLog('Na biurku: notatka służbowa od Zielińskiego. "Proszę o rozszerzenie uprawnień do sekcji D. Uzasadnienie: archiwizacja." Podejrzane — nie potrzebował tych uprawnień.'); }
          else addLog('Biurko przeszukane.');
          break;
        case 'examine_broken_cup':
          if (!getFlag('brokenCup')) { setFlag('brokenCup'); addLog('Pęknięta filiżanka na podłodze. Ślady kawy. Ktoś się tu kłócił? Może Minister i Zieliński?'); }
          else addLog('Pęknięta filiżanka. Ślad kłótni.');
          break;
        case 'open_minister_safe':
          if (getFlag('minSafeOpen')) addLog('Sejf w ścianie jest otwarty i pusty.');
          else { setShowCodepad('min_safe'); }
          break;
        case 'examine_office_window':
          if (!getFlag('offWinChecked')) { setFlag('offWinChecked'); addLog('Okno gabinetu zamknięte, alarmed. Nikt nie wchodził tędy. Dokument musiał wyjść przez drzwi.'); }
          else addLog('Okno zabezpieczone. Wykluczone.');
          break;
        case 'examine_drawer_d7':
          if (!getFlag('d7examined')) { setFlag('d7examined'); addLog('Szuflada D-7 pusta! Tu powinien leżeć Dokument Omega. Ktoś go wyjął po 23:00 — ostatni zapis w rejestrze.'); }
          else addLog('Szuflada D-7 pusta.');
          break;
        case 'examine_button':
          if (!inventory.includes('guzik_munduru')) { addToInventory('guzik_munduru'); addLog('Guzik od munduru ochrony! Wyrwany siłą. Ochroniarz Wojciechowski tu był — i się śpieszył.'); }
          else addLog('Guzik zabezpieczony.');
          break;
        case 'examine_archive_camera':
          if (!inventory.includes('zdjecie_cctv')) { addToInventory('zdjecie_cctv'); addLog('Kamera odwrócona, ale jeden kadr się zapisał: sylwetka mężczyzny w mundurze ochrony, korytarz archiwum, godzina 1:15.'); }
          else addLog('Zdjęcie z CCTV zabezpieczone.');
          break;
        case 'examine_terminal':
          if (!getFlag('terminalChecked')) { setFlag('terminalChecked'); addLog('Terminal dostępu: ostatnie logowanie — Zieliński, 23:30. Status: "Wypożyczono OMEGA". Oficjalnie miał prawo, ale o tej porze?'); }
          else addLog('Terminal: Zieliński wypożyczył Omega o 23:30.');
          break;
        case 'examine_archive_vent':
          if (!getFlag('archVentChecked')) { setFlag('archVentChecked'); addLog('Kratka wentylacyjna poluzowana. Ktoś tu wchodził nieoficjalnie? Albo to droga ewakuacji dokumentu.'); }
          else addLog('Wentylacja — nieoficjalne wejście.');
          break;
        case 'talk_kumar':
          if (!getFlag('kumarTalked')) { setFlag('kumarTalked'); addLog('Kumar (IT): "Zauważyłem dziwny transfer danych nocą. 340MB o 1:17 z terminala KANCELARIA-01. Ktoś użył konta z uprawnieniami admina."'); }
          else if (inventory.includes('pendrive') && !getFlag('kumarWitness')) { setFlag('kumarWitness'); addToInventory('zeznanie_kumara'); addLog('Kumar: "Pułkownik Zieliński prosił mnie o hasło admina tydzień temu! Dałem, bo to mój przełożony. Teraz rozumiem..."'); }
          else addLog('Kumar czeka na dalsze instrukcje.');
          break;
        case 'examine_transfer_logs':
          if (!inventory.includes('logi_dane')) { addToInventory('logi_dane'); addLog('Logi: O 1:17 — transfer 340MB z KANCELARIA-01 na nośnik USB. Login: admin_override. Ktoś użył konta uprzywilejowanego!'); }
          else addLog('Logi: 340MB skopiowane o 1:17.');
          break;
        case 'examine_usb':
          if (!inventory.includes('pendrive')) { addToInventory('pendrive'); addLog('Pod biurkiem: pendrive 8GB. Zaszyfrowany, ale data ostatniej modyfikacji: dzisiejsza noc, 1:20. To nośnik!'); }
          else addLog('Pendrive zabezpieczony.');
          break;
        case 'examine_backup':
          if (!getFlag('backupChecked')) { setFlag('backupChecked'); addToInventory('notatka_kumar'); addLog('Notatka Kumara przy serwerze: "Transfer z KANCELARIA-01 nieautoryzowany. Zgłosić?" Nie zdążył zgłosić.'); }
          else addLog('Notatka Kumara o nieautoryzowanym transferze.');
          break;
        case 'talk_guard_omega':
          if (!getFlag('guardOmegaTalked')) { setFlag('guardOmegaTalked'); addLog('Wojciechowski: "Normalny dyżur. Obchody co godzinę. Niczego podejrzanego nie widziałem." Spocony i unika wzroku.'); }
          else if (inventory.includes('koperta_parking') && !getFlag('guardOmegaBroken')) { setFlag('guardOmegaBroken'); addLog('Pokazujesz kopertę z 50 000 zł. Wojciechowski łamie się: "Pułkownik mi zapłacił! Kazał otworzyć archiwum i odwrócić kamerę. Nie wiedziałem po co!"'); }
          else if (inventory.includes('guzik_munduru') && !getFlag('guardOmegaButton')) { setFlag('guardOmegaButton'); addLog('Guzik od munduru. Wojciechowski: "Haczyłem o segregator w archiwum... byłem tam, przyznaję."'); }
          else addLog('Wojciechowski milczy.');
          break;
        case 'examine_cctv_omega':
          if (!getFlag('cctvOmega')) { setFlag('cctvOmega'); addLog('Monitoring: między 23:00 a 3:00 nagrania z korytarza archiwum SKASOWANE. Ktoś miał dostęp do systemu ochrony.'); }
          else addLog('Nagrania z archiwum skasowane.');
          break;
        case 'examine_schedule':
          if (!inventory.includes('grafik_dok')) { addToInventory('grafik_dok'); addLog('Grafik: Wojciechowski miał nocny dyżur SAM. Druga zmiana została odwołana na prośbę... pułkownika Zielińskiego!'); }
          else addLog('Grafik: Wojciechowski sam na dyżurze.');
          break;
        case 'search_guard_desk':
          if (!inventory.includes('telefon_burner')) { addToInventory('telefon_burner'); addLog('W szufladzie: drugi telefon! Prepaid. SMS: "Paczka gotowa. Miejsce jak zwykle. — K." Kto to K? Kontakt z wywiadem?'); }
          else addLog('Szuflada przeszukana.');
          break;
        case 'examine_guard_car':
          if (!inventory.includes('koperta_parking')) { addToInventory('koperta_parking'); addLog('Bagażnik samochodu Wojciechowskiego niedomknięty! W środku: gruba koperta — 50 000 zł w banknotach 500-złotowych! Łapówka!'); }
          else addLog('Bagażnik przeszukany.');
          break;
        case 'examine_cigarette':
          if (!inventory.includes('papieros_obcy')) { addToInventory('papieros_obcy'); addLog('Niedopałek papierosa "Sobranie" — rosyjska marka premium. Nikt w biurze ich nie pali. Kontakt z obcym wywiadem?'); }
          else addLog('Niedopałek "Sobranie" — rosyjska marka.');
          break;
        case 'examine_parking_camera':
          if (!getFlag('parkCam')) { setFlag('parkCam'); addToInventory('odcisk_buta_o'); addLog('Kamera na parkingu: O 3:00 Wojciechowski wkłada coś do bagażnika. Obok odcisk buta rozm. 45 — pasuje do ochrony.'); }
          else addLog('Nagranie z parkingu zabezpieczone.');
          break;
        case 'examine_parking_trash':
          if (!getFlag('parkTrash')) { setFlag('parkTrash'); addLog('W koszu: zmięta kartka z numerem telefonu zagranicznym (+7...) i słowo "OMEGA" napisane ołówkiem. Ktoś miał kontakt z Rosją!'); }
          else addLog('Kartka z rosyjskim numerem.');
          break;
        case 'talk_colonel':
          if (!getFlag('colonelTalked')) { setFlag('colonelTalked'); addLog('Pułkownik Zieliński (spokojnie): "Wypożyczyłem Omega do przeglądu bezpieczeństwa. Standardowa procedura. Oddałem o 1:30." Zbyt spokojny?'); }
          else if (inventory.includes('logi_dane') && inventory.includes('zeznanie_kumara') && !getFlag('colonelCaught')) {
            setFlag('colonelCaught');
            addLog('Konfrontujesz Zielińskiego z logami i zeznaniem Kumara. Pułkownik blednie: "To... Kumar się myli. Ja nie..." Zacina się. Pot na czole.');
          }
          else addLog('Zieliński powtarza: "Standardowa procedura."');
          break;
        case 'examine_correspondence':
          if (!inventory.includes('dziennik_wpis')) { addToInventory('dziennik_wpis'); addLog('Dziennik: "23:30 — Omega wypożyczona: Zieliński. 1:30 — Omega zwrócona: Zieliński." Ale dokument nie wrócił na miejsce!'); }
          else addLog('Wpis: Zieliński wypożyczył i rzekomo zwrócił.');
          break;
        case 'examine_copier':
          if (!inventory.includes('kopia_omega')) { addToInventory('kopia_omega'); addLog('Kopiarka ciepła! Na szkle: resztki tonera. W tacce: niekompletna kopia stron 12-18 Dokumentu Omega! Ktoś kopiował pospiesznie!'); }
          else addLog('Częściowa kopia Omega zabezpieczona.');
          break;
        case 'examine_classified_cabinet':
          if (!inventory.includes('klucz_archiwum')) { addToInventory('klucz_archiwum'); addLog('W szafie z dokumentami: NIEOFICJALNA kopia klucza do archiwum! To nie klucz z zestawu — ktoś go dorobił.'); }
          else addLog('Kopia klucza zabezpieczona.');
          break;
        case 'ending_check': {
          const hasTransfer = inventory.includes('logi_dane') || inventory.includes('kopia_omega');
          const hasWitness = inventory.includes('zeznanie_kumara') || inventory.includes('zeznanie_sekr') || getFlag('guardOmegaBroken');
          const hasMoney = inventory.includes('koperta_parking');
          const hasLink = getFlag('colonelCaught') || (inventory.includes('dziennik_wpis') && inventory.includes('klucz_archiwum'));
          if (hasTransfer && hasWitness && hasMoney && hasLink) { playSuccessSound(); setGameWon(true); }
          else { const m = []; if (!hasTransfer) m.push('dowód kradzieży danych'); if (!hasWitness) m.push('zeznanie świadka'); if (!hasMoney) m.push('dowód przekupstwa'); if (!hasLink) m.push('powiązanie ze zdrajcą'); addLog(`Brakuje: ${m.join(', ')}. Szukaj dalej!`); }
          break;
        }
        default: addLog('Nic się nie dzieje.');
      }
    }
  }, [caseData, flags, inventory, selectedItem, addLog, addToInventory, setFlag, getFlag, handleMove]);

  const handleCombine = useCallback((item1, item2) => {
    const pair = [item1, item2].sort().join('+');
    if (caseData.id === 'blackwood') {
      if (pair === 'baterie+latarka_uv_pusta') { setInventory(prev => prev.filter(i => i !== 'latarka_uv_pusta' && i !== 'baterie').concat('latarka_uv')); playSuccessSound(); addLog('Latarka UV działa!'); return true; }
      if (pair === 'zdjecie_1+zdjecie_2') { setInventory(prev => prev.filter(i => i !== 'zdjecie_1' && i !== 'zdjecie_2').concat('zdjecie_pelne')); playSuccessSound(); addLog('Zdjęcie sklejone! Ogrodnik z narzędziem zbrodni.'); return true; }
    }
    if (caseData.id === 'diamond') {
      if (pair === 'rekawiczka+wlokna') { playSuccessSound(); addLog('Włókna pasują idealnie do rękawiczki! Należą do tej samej osoby.'); setFlag('glovesMatched'); return true; }
    }
    if (caseData.id === 'opera') {
      if (pair === 'fiolka+kielich_dowod') { playSuccessSound(); addLog('Substancja w kielichu pochodzi z tej fiolki! To ten sam tojad. Truciciel użył tego pojemnika.'); setFlag('poisonMatched'); return true; }
      if (pair === 'list_milosny+zapalniczka_rz') { playSuccessSound(); addLog('"R" z listu to Rudolf Zawadzki! Zapalniczka potwierdza — R.Z. to krytyk-kochanek!'); setFlag('rIdentified'); return true; }
    }
    if (caseData.id === 'omega') {
      if (pair === 'guzik_munduru+zdjecie_cctv') { playSuccessSound(); addLog('Guzik pasuje do munduru na zdjęciu CCTV! Mężczyzna na nagraniu to Wojciechowski.'); setFlag('guardIdentified'); return true; }
      if (pair === 'logi_dane+pendrive') { playSuccessSound(); addLog('Logi transferu zgadzają się z pendrive! Dane skopiowane o 1:17 trafiły na ten właśnie nośnik.'); setFlag('dataLinked'); return true; }
    }
    return false;
  }, [caseData, addLog, setFlag]);

  const handleItemUse = useCallback((itemKey) => {
    if (caseData.id === 'blackwood' && itemKey === 'telefon') {
      if (getFlag('phoneUnlocked')) addLog('Telefon: Wiadomości od "O" — groźby i wzmianka o Selk.');
      else setShowCodepad('phone');
      return true;
    }
    return false;
  }, [caseData, getFlag, addLog]);

  return {
    currentRoom, currentRoomId, inventory, logs, flags,
    selectedItem, setSelectedItem,
    showCodepad, setShowCodepad,
    gameWon, setGameWon,
    steps, startTime: startTime.current,
    handleMove, handleAction, handleCombine, handleCodeSubmit, handleItemUse
  };
};
