# Informační a organizační systém úloh (INOSU – frontend)

**Jan Holeček** | V4B

Profilová část maturitní zkoušky – **Maturitní práce**

Střední průmyslová škola Brno, Purkyňova, příspěvková organizace | Brno 2026

---

## Prohlášení

Prohlašuji, že:

- jsem maturitní práci na téma **INOSU – Frontend** vypracoval samostatně a použil jen zdroje uvedené v seznamu literatury.

Beru na vědomí, že:

- zpráva o řešení maturitní práce a základní dokumentace k aplikaci bude uložena v elektronické podobě v IS SharePoint Střední průmyslové školy Brno, Purkyňova;
- bude má maturitní práce včetně zdrojových kódů uložena v knihovně SPŠ Brno, Purkyňova, dostupná k prezenčnímu nahlédnutí;
- SPŠ Brno, Purkyňova má právo celou moji práci použít k výukovým účelům a po mém souhlasu moji práci nevýdělečně užít ke své vnitřní potřebě;
- pokud je součástí mojí práce jakýkoliv softwarový produkt, považují se za součást práce i zdrojové kódy, které jsou předmětem maturitní práce, případně soubory, ze kterých se práce skládá. Součástí práce není software/aplikace, který je pro tvorbu a následnou obhajobu práce pouze využíván za přesně definovaných podmínek.

**Jméno, příjmení:** Jan Holeček  
**Adresa:** Syrovice 80, Syrovice 664 67

---

## Poděkování

Rád bych poděkoval vedoucímu mé maturitní práce Ing. Petru Duškovi za jeho ochotu, vstřícný přístup a cenné odborné rady, které mi poskytoval v průběhu zpracování této práce. Jeho zkušenosti a připomínky mi pomohly lépe porozumět dané problematice a přispěly ke kvalitnějšímu výsledku celé práce.

Dále bych chtěl poděkovat programátorovi Ondřeji Votavovi za jeho významný podíl na backendové části webové aplikace. Velmi si vážím jeho přístupu, spolehlivosti a ochoty řešit vzniklé problémy. Spolupráce s ním probíhala na velmi dobré úrovni, komunikace byla bezproblémová a týmová práce díky tomu probíhala plynule a efektivně.

---

## Anotace

Cílem práce je vytvořit webovou aplikaci pro správu úkolů, projektů, a především maturitních prací ve školním prostředí. Aplikace umožní učitelům i studentům efektivně komunikovat, plánovat a spravovat jednotlivé projekty, třídy a skupiny žáků. Výsledkem je funkční systém, který slouží jako přehledný nástroj pro koordinaci maturitních prací a souvisejících aktivit (odlehčená, jednoúčelová verze Microsoft Teams).

**Abstract:** The aim of this thesis is to develop a web application for managing tasks, projects, and graduation theses in a school environment. The application will enable teachers and students to communicate effectively, plan, and manage individual projects, classes, and student groups. The result is a functional system serving as a clear and organized tool for coordinating graduation theses and related activities (a lightweight, single-purpose alternative to Microsoft Teams).

---

## Obsah

1. [Teoretický úvod](#teoretický-úvod)
2. [Návrhy a rozbor řešení](#návrhy-a-rozbor-řešení)
   - [Rozbor problému a cíle aplikace](#rozbor-problému-a-cíle-aplikace)
   - [Architektura aplikace](#architektura-aplikace)
   - [Návrh struktury stránek a navigace](#návrh-struktury-stránek-a-navigace)
   - [Datové modely a typy](#datové-modely-a-typy)
   - [Použité technologie](#použité-technologie)
   - [Struktura aplikace](#struktura-aplikace)
   - [Komunikace s backendem](#komunikace-s-backendem)
   - [Správa stavu aplikace](#správa-stavu-aplikace)
   - [Zabezpečení aplikace](#zabezpečení-aplikace)
3. [Experimentální část](#experimentální-část)
   - [Realizace vybraných částí aplikace](#realizace-vybraných-částí-aplikace)
   - [Testování aplikace](#testování-aplikace)
4. [Závěr](#závěr)

---

## Teoretický úvod

Webové aplikace dnes tvoří základ většiny moderních informačních systémů. Na rozdíl od klasických desktopových aplikací nevyžadují instalaci do zařízení uživatele. Stačí webový prohlížeč a připojení k internetu, díky čemuž jsou přístupné z libovolného zařízení a operačního systému.

Webové aplikace se skládají ze dvou hlavních částí: frontendu a backendu. Backend zajišťuje logiku na straně serveru a komunikaci s databází. Frontend je část, se kterou uživatel přímo pracuje – vizuální rozhraní zobrazované v prohlížeči. Tyto dvě části spolu komunikují prostřednictvím rozhraní REST API, které využívá standardní protokol HTTP a formát JSON pro výměnu dat. Frontendová část této aplikace je vytvořena pomocí frameworku Nuxt 4 postaveného na Vue.js, přičemž pro psaní kódu je využit jazyk TypeScript a pro stylování SCSS.

Výsledná aplikace INOSU (Informační a organizační systém úloh) nabízí ucelenou sadu funkcí pro správu školní agendy. Po přihlášení do systému má každý uživatel přístup k hlavnímu přehledu a kalendáři, kde jsou zobrazeny relevantní události a termíny. Součástí aplikace je chat, umožňující komunikaci v rámci konkrétních úkolů i napříč systémem.

Jednou z hlavních oblastí je **správa úkolů**. Učitelé mohou úkoly vytvářet, upravovat, mazat a přiřazovat je jednotlivým studentům nebo celým týmům. Studenti vidí úkoly, které jsou jim přiřazeny, a mohou v jejich rámci komunikovat s vyučujícím.

Druhou klíčovou oblastí je **správa maturitních prací**. Systém rozlišuje různé role studenta, garanta a oponenta. Student podává návrhy témat, sleduje jejich stav, a komunikuje s garantem prostřednictvím chatu. Garanti a oponenti mají přístup k přehledným tabulkám s přiřazenými pracemi, mohou spravovat témata, zadání a hodnocení. Systém tak pokrývá celý průběh maturitní práce od návrhu tématu až po závěrečné hodnocení.

Administrátoři systému mají k dispozici nástroje pro správu uživatelů (studentů i učitelů), správu tříd a oborů, a dále možnost hromadného importu dat a exportu pro další zpracování.

Motivací pro vznik tohoto projektu byla absence jednotného nástroje pro koordinaci maturitních prací na škole. Stávající obecné nástroje, jako je Microsoft Teams a Edupage, jsou pro tento účel zbytečně složité a nepřehledné. Cílem bylo vytvořit jednoduchý, přehledný a na míru šitý systém.

---

## Návrhy a rozbor řešení

### Rozbor problému a cíle aplikace

Před zahájením vývoje bylo nutné navrhnout, jak bude aplikace technicky fungovat a jak bude strukturována. Tato podkapitola popisuje klíčová architektonická rozhodnutí, logické uspořádání stránek a datové struktury, se kterými aplikace pracuje.

### Architektura aplikace

Při návrhu architektury bylo potřeba rozhodnout, jakým způsobem bude aplikace vykreslovat stránky a jak bude organizována komunikace mezi uživatelem a backendem. V moderním webovém vývoji existují tři hlavní přístupy k vykreslování:

- **CSR** – stránka se vykresluje výhradně v prohlížeči uživatele. Server odešle prázdné HTML spolu s celým balíčkem skriptů, veškerá logika pak běží na straně klienta. Výhodou je jednoduchá serverová infrastruktura. Zásadní nevýhodou jsou omezené bezpečnostní možnosti – veškerý kód je přístupný v prohlížeči.

- **SSG** – stránky jsou vygenerovány jednou při sestavení aplikace a distribuovány jako statické soubory. Vhodné pro obsah, který se nemění v závislosti na uživateli. Pro tento projekt zcela nevhodné, protože celá aplikace je dynamická.

- **SSR s hydratací** – při prvním otevření stránky server připraví celý obsah a odešle ho prohlížeči jako hotové HTML. Po zobrazení stránky se na pozadí stáhne Vue.js, který se napojí na zobrazené HTML a oživí ho (hydratace). Od tohoto okamžiku se aplikace chová jako SPA. Tento hybridní přístup spojuje výhodu rychlého prvotního zobrazení díky SSR a plynulého ovládání díky SPA.

SSR byl zvolen právě kvůli kombinaci těchto vlastností a zároveň kvůli možnosti provozovat proxy vrstvu na straně serveru.

Výsledná architektura celé aplikace je třívrstevná:

```
Prohlížeč (Vue.js / SPA) <> Nuxt server (SSR + proxy) <> Backend REST API
```

### Návrh struktury stránek a navigace

Oddělení veřejné a chráněné části bylo základním požadavkem. Přihlašovací stránka a obnova hesla musí být přístupné bez přihlášení, veškerý obsah aplikace naopak nikoli. Všechny chráněné stránky jsou proto soustředěny pod společnou cestu `/panel`.

Sdílení stránek mezi rolemi bylo klíčovým rozhodnutím z hlediska udržovatelnosti kódu. Bylo proto zvoleno dynamické routování pomocí parametrů v URL adrese. Například `/panel/tasks/teacher` a `/panel/tasks/admin` využívají stejnou stránku, která se přizpůsobí podle hodnoty parametru.

Řízení přístupu na úrovni stránek bylo navrženo tak, aby každá stránka sama deklarovala, které role k ní mají přístup. Middleware tuto deklaraci při navigaci ověří a v případě nedostatečného oprávnění přesměruje uživatele na chybovou stránku 403.

### Datové modely a typy

Protože aplikace používá TypeScript, bylo rozhodnuto definovat pro každou hlavní entitu vlastní typ nebo rozhraní. Typy jsou rozděleny do samostatných souborů podle oblasti:

- `account.ts` – data přihlášeného uživatele a jeho účtu
- `tasks.ts` – data úkolu a jeho přiřazení
- `maturita.ts` – data maturitního ročníku a témat
- `maturitaTables.ts` – data pro přehledové tabulky v sekci maturit
- `classes.ts` – data školní třídy
- `team.ts` – data týmu přiřazeného k úkolu
- `chat.ts` – data konverzací a zpráv
- `calendar.ts` – data kalendářních událostí
- `specialization.ts` – data studijního oboru

### Použité technologie

#### Vývojové prostředí – WebStorm

WebStorm je IDE od společnosti JetBrains určené primárně pro vývoj webových aplikací v JavaScriptu a TypeScriptu. Pro projekt byl zvolen díky nativní podpoře Nuxt a Vue.js bez nutnosti instalace dalších rozšíření.

#### Správa verzí – Git a GitHub

Git je distribuovaný systém správy verzí umožňující sledovat historii změn v kódu. GitHub slouží jako vzdálené úložiště a platforma pro nasazení aplikace pomocí CI/CD pipeline.

#### Správce balíčků – pnpm

pnpm je moderní správce balíčků pro Node.js. Ukládá všechny balíčky centrálně na disku a do projektů je pouze odkazuje, čímž zajišťuje výrazně rychlejší instalaci a nižší spotřebu místa na disku.

#### Programovací jazyky – TypeScript

TypeScript je nadmnožina jazyka JavaScript vyvinutá společností Microsoft, která přidává statické typování. V projektu je TypeScript používán ve striktním režimu.

#### Framework Vue.js a Nuxt

Vue.js je progresivní JavaScriptový framework pro tvorbu uživatelských rozhraní postavený na komponentovém přístupu. Nuxt je framework postavený nad Vue.js, který rozšiřuje jeho možnosti o strukturu projektu, automatické importy, směrování stránek a serverové vykreslování.

#### Kontejnerizace – Docker

Docker řeší nasazení aplikace kontejnerizací. Aplikace je zabalena do izolované jednotky, která funguje stejně bez ohledu na operační systém nebo server. Dockerfile projektu definuje tři fáze sestavení: vývojová, sestavovací a produkční.

#### Stylování – SCSS

SCSS je preprocesor jazyka CSS rozšiřující jeho možnosti o proměnné, vnořená pravidla a mixiny. Globální styly jsou rozděleny do tří souborů: proměnné, globální pravidla a hlavní styly.

#### Použité knihovny

- **ESLint** – nástroj pro statickou analýzu kódu
- **Pinia** – knihovna pro správu globálního stavu aplikace
- **nuxt-security** – modul nastavující bezpečnostní HTTP hlavičky a CORS pravidla
- **@nuxtjs/i18n** – modul zajišťující lokalizaci rozhraní
- **@nuxt/image** – modul pro optimalizaci obrázků
- **@vueup/vue-quill** – editor formátovaného textu
- **@yuta-inoue-ph/nuxt-vcalendar** – komponenta kalendáře
- **@bhplugin/vue3-datatable** – komponenta datové tabulky s podporou stránkování, řazení a filtrování

---

## Struktura aplikace

### Adresářová struktura projektu

Projekt se drží konvencí frameworku Nuxt. Veškerý zdrojový kód je soustředěn ve složce `app/`, která se dělí na několik podsložek:

| Složka | Účel |
|--------|------|
| `pages/` | Všechny stránky aplikace – struktura souborů odpovídá URL adresám |
| `components/` | Znovupoužitelné Vue komponenty sdílené napříč stránkami |
| `layouts/` | Layouty definující společný vizuální obal pro skupiny stránek |
| `middleware/` | Funkce spouštěné při každé navigaci mezi stránkami |
| `stores/` | Pinia stores – centrální úložiště sdílených dat |
| `componsables/` | Sdílené funkce volatelné odkudkoliv v aplikaci |
| `plugins/` | Soubory spouštěné při inicializaci aplikace |
| `assets/` | Statické soubory (SCSS styly, obrázky) |
| `types/` | TypeScript typy a rozhraní |
| `server/` | Serverový kód běžící výhradně na straně serveru |
| `i18n/` | Překladové soubory pro jednotlivé jazyky |

Kořenový adresář obsahuje konfigurační soubory: `nuxt.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `package.json`, `pnpm-lock.yaml`, `Dockerfile` a `docker-compose.yml`.

### Směrování stránek

Nuxt využívá tzv. file-based routing – URL adresy jsou automaticky odvozeny ze struktury souborů ve složce `pages/`. Soubor `index.vue` odpovídá kořenové adrese složky. Například `pages/panel/calendar.vue` je dostupný na adrese `/panel/calendar`.

Pro stránky s proměnnou částí URL Nuxt podporuje dynamické segmenty vyjádřené hranatými závorkami v názvu souboru. Každá stránka může pomocí funkce `definePageMeta()` deklarovat metadata, především seznam rolí, které k ní mají přístup.

### Layouty

Aplikace používá dva layouty:

- **Výchozí layout** (`default.vue`) – pro veřejnou část (přihlašovací stránka, obnova hesla). Minimální obal bez navigačních prvků.
- **Panelový layout** (`panel.vue`) – obaluje celou přihlášenou část aplikace. Zajišťuje zobrazení postranního menu a systému alertů. Řeší stavy načítání dat a překročení rate limitu API.

### Middleware

Aplikace používá dva middlewary, spouštěné vždy v pevném pořadí:

**Middleware `auth`** ověří platnost přihlašovací relace na straně backendu. Pokud uživatel není přihlášen, přesměruje ho na přihlašovací stránku. Pokud je přihlášení platné, načte uložené nastavení rozhraní a data přihlášeného uživatele (ze sessionStorage nebo z API).

**Middleware `verify`** přečte z metadat cílové stránky seznam povolených rolí. Porovná je s rolí aktuálně přihlášeného uživatele a v případě nesouladu přesměruje uživatele na chybovou stránku 403.

### Pluginy

- **`pinia.ts`** – registruje knihovnu Pinia do Vue instance
- **`i18n-locale-loader.ts`** – načítá jazyk uložený v localStorage

### Organizace komponent

Komponenty jsou rozděleny do čtyř složek:

- **`layout/`** – postranní menu, navigační lišta, systém alertů, komponenta chatu
- **`ui/`** – obecné uživatelské prvky (vstupní pole, editor textu, nahrávání souborů, stránkování, indikátor načítání, breadcrumb, akční lišta)
- **`manage/`** – komponenty pro zobrazení a úpravu údajů uživatelského účtu (profilový obrázek, jméno, e-mail, heslo aj.)
- **`tables/`** – komponenty datových tabulek pro jednotlivé sekce aplikace

Komponenty komunikují třemi způsoby: **props** (předávání dat od rodiče k dítěti), **emity** (informování rodiče o událostech) a **defineExpose** (záměrné zpřístupnění funkcí nebo hodnot rodiči).

---

## Komunikace s backendem

### Architektura komunikace

Veškerá komunikace prochází přes proxy vrstvu běžící na Nuxt serveru. Každý HTTP požadavek na cestu začínající `/api/` dorazí nejprve na Nuxt server, kde ho zachytí catch-all handler. Ten z URL adresy odstraní prefix `/api`, sestaví cílovou adresu a celý požadavek transparentně přepošle dál na backend.

Pro odesílání požadavků jsou využívány dva nástroje:
- **`$fetch`** – pro požadavky v reakci na konkrétní akci (ověřování přihlášení, odeslání formuláře)
- **`useFetch`** – pro načítání dat přímo ve stránkách, automaticky spustí požadavek při načtení komponenty

### HTTP požadavky a formát dat

| Metoda | Použití |
|--------|---------|
| `GET` | Načítání dat (seznam uživatelů, úkolů, záznamů) |
| `POST` | Vytváření nových záznamů |
| `PUT` | Úprava existujících záznamů |
| `DELETE` | Mazání záznamů |

Přenášeným formátem je JSON. Data a časy jsou odesílány jako Unix timestamp. Backend vrací odpovědi vždy obsahující `resCode` (kód identifikující výsledek operace) a pole `data`.

### Zpracování odpovědí a chybových stavů

Každá odpověď je zpracována v callback funkci `onResponse`. Hodnota `resCode` se porovnává příkazem `switch` s předem známými kódy a každý případ spustí odpovídající reakci (zobrazení chyby, přesměrování, aktualizace dat).

Zvláštním chybovým stavem je překročení rate limitu API (kód `E10100`). Při jeho detekci se nastaví příznak v loading store a panelový layout zobrazí chybovou obrazovku s možností opakovat akci.

Nahrávání souborů využívá nativní rozhraní prohlížeče `XMLHttpRequest` místo standardního `$fetch`, protože umožňuje sledovat průběh nahrávání pomocí události `progress`.

---

## Správa stavu aplikace

### Pinia stores

Aplikace využívá tři globální stores:

- **Account store** – uchovává data přihlášeného uživatele načtená middlewarem `auth`
- **Loading store** – sleduje stavy načítání a překročení rate limitu; panelový layout podle těchto hodnot rozhoduje o zobrazení
- **Alerts store** – správa systémových oznámení zobrazovaných uživateli po provedených akcích; umožňuje automatické odebrání po uplynutí časového limitu

### Ukládání dat v prohlížeči

- **Session storage** – dočasné úložiště pro data přihlášeného uživatele; obsah se smaže po zavření záložky. Data jsou před uložením zakódována composablem `useSimpleDataCipher`.
- **Local storage** – trvalé úložiště pro uživatelské preference: zvolené téma rozhraní, jazyk aplikace a vlastní rychlé odkazy.

---

## Zabezpečení aplikace

Bezpečnostní hlavičky jsou zajištěny modulem `nuxt-security` (aktivní pouze v produkčním prostředí):

- **Content-Security-Policy** – určuje povolené zdroje obrázků
- **Referrer-Policy** (`origin`) – při přechodu na jinou stránku odesílá pouze doménu aplikace, nikoliv celou URL
- **Cross-Origin-Embedder-Policy** – zabraňuje načítání externích zdrojů bez explicitního povolení
- **CORS** – povoluje požadavky pouze z adresy definované v proměnném prostředí (`SERVER_URL`), metody GET, POST, PUT a DELETE
- **X-Powered-By** – hlavička je skryta, aby neodhalovala použitý framework

Vlastní rate limiter modulu `nuxt-security` je záměrně vypnutý, protože je řešen na straně backendu.

---

## Experimentální část

### Realizace vybraných částí aplikace

#### Nahrávání souborů na server

Zpočátku se řešení zdálo jednoduché, problém však nastal při snaze zobrazit průběh nahrávání – běžně používaný `$fetch` tuto funkcionalitu nepodporuje. Z tohoto důvodu bylo nutné využít rozhraní `XMLHttpRequest`, které umožňuje sledovat průběh pomocí události `progress`.

Pro zabezpečení nahrávání byl implementován třífázový proces:
1. Frontend odešle metadata souboru
2. Backend vytvoří cílové umístění a vrátí jednorázovou URL adresu
3. Soubor je nahrán na tuto URL

#### Export dat a stahování souborů

Při implementaci stahování bylo nutné vyřešit:
- Správné pojmenování souboru z HTTP hlavičky `content-disposition` (UTF-8 i ASCII varianta)
- Zpracování různých formátů odpovědi ze serveru (Blob, ArrayBuffer, text, JSON) do jednotného formátu Blob
- Spuštění stahování vytvořením dočasné URL adresy přiřazené dynamickému odkazu

#### Přepínání tématu bez bliknutí

Aplikace podporuje světlé, tmavé a systémové téma. Problém byl v tom, že po obnovení stránky vždy na zlomek sekundy probliklo světlé téma, i když měl uživatel nastavené tmavé. Příčina spočívá v SSR – server vždy odešle HTML s výchozím světlým tématem.

Řešením bylo vložit malý JavaScriptový blok přímo do `<head>` stránky v konfiguraci Nuxtu, který se spustí okamžitě před vykreslením stránky a nastaví správné téma. Systémové téma reaguje na nastavení operačního systému pomocí `window.matchMedia`.

---

## Testování aplikace

Vzhledem k povaze projektu nebylo využito automatizované testování. Aplikace byla testována manuálně průběžně během celého vývoje ve třech oblastech.

### Manuální testování funkcionality

Každá nově implementovaná funkce byla testována ručně přímo v prohlížeči průchodem celého toku dané funkce. Součástí bylo i ověřování chybových stavů: záměrné odeslání neúplného formuláře, zadání neplatných hodnot nebo simulace chyby backendu. Testování probíhalo s reálným backendem, nikoliv s testovacími daty.

### Testování rolí a přístupových práv

Testování probíhalo přihlášením pod různými účty (student, učitel, administrátor) a ověřováním, že každá role má přístup pouze k odpovídajícím částem aplikace.

| Stránka | Student | Učitel | Administrátor |
|---------|:-------:|:------:|:-------------:|
| panel/index | Ano | Ano | Ano |
| panel/calendar | Ano | Ano | Ano |
| panel/chat | Ano | Ano | Ano |
| panel/export | Ne | Ano | Ano |
| panel/classes/index | Ano | Ano | Ano |
| panel/classes/add | Ne | Ne | Ano |
| panel/classes/remove | Ne | Ne | Ano |
| panel/specializations/index | Ano | Ano | Ano |
| panel/specializations/add | Ne | Ne | Ano |
| panel/specializations/remove | Ne | Ne | Ano |
| panel/import/index | Ne | Ne | Ano |
| panel/import/classes | Ne | Ne | Ano |
| panel/import/specializations | Ne | Ne | Ano |
| panel/import/maturitas | Ne | Ano | Ano |
| panel/import/maturitaTopics | Ne | Ano | Ano |
| panel/tasks/student/index | Ano | Ne | Ne |
| panel/tasks/student/[taskId]/[guarantorId]/[teamId] | Ano | Ne | Ne |
| panel/tasks/[role]/index | Ne | Ano | Ano |
| panel/tasks/[role]/add | Ne | Ano | Ano |
| panel/tasks/[role]/remove | Ne | Ano | Ano |
| panel/tasks/[role]/[taskId]/index | Ne | Ano | Ano |
| panel/tasks/[role]/[taskId]/edit | Ne | Ano | Ano |
| panel/tasks/[role]/[taskId]/[teamId] | Ne | Ano | Ano |
| panel/tasks/[role]/[taskId]/assign/index | Ne | Ano | Ano |
| panel/tasks/[role]/[taskId]/assign/individuals | Ne | Ano | Ano |
| panel/tasks/[role]/[taskId]/assign/remove | Ne | Ano | Ano |
| panel/tasks/[role]/[taskId]/assign/teams/index | Ne | Ano | Ano |
| panel/tasks/[role]/[taskId]/assign/teams/[teamId] | Ne | Ano | Ano |
| panel/maturita/student/index | Ano | Ne | Ne |
| panel/maturita/student/chat | Ano | Ne | Ne |
| panel/maturita/student/proposals/index | Ano | Ne | Ne |
| panel/maturita/student/proposals/add | Ano | Ne | Ne |
| panel/maturita/student/proposals/remove | Ano | Ne | Ne |
| panel/maturita/student/proposals/rejected | Ano | Ne | Ne |
| panel/maturita/student/proposals/[taskId]/[guarantorId] | Ano | Ne | Ne |
| panel/maturita/[role]/tasks/index | Ne | Ano | Ano |
| panel/maturita/[role]/tasks/add | Ne | Ano | Ano |
| panel/maturita/[role]/tasks/remove | Ne | Ano | Ano |
| panel/maturita/[role]/tasks/[taskId]/edit | Ne | Ano | Ano |
| panel/maturita/[role]/tasks/[taskId]/[teamId]/index | Ne | Ano | Ano |
| panel/maturita/[role]/tasks/[taskId]/[teamId]/chat | Ne | Ano | Ano |
| panel/maturita/[role]/topics/index | Ano | Ano | Ano |
| panel/maturita/[role]/topics/add | Ne | Ano | Ano |
| panel/maturita/[role]/topics/remove | Ne | Ano | Ano |
| panel/maturita/[role]/grade/index | Ne | Ano | Ano |
| panel/maturita/[role]/grade/add | Ne | Ano | Ano |
| panel/maturita/[role]/grade/remove | Ne | Ano | Ano |
| panel/maturita/[role]/grade/[maturitaId]/edit | Ne | Ano | Ano |
| panel/maturita/[role]/proposals | Ne | Ano | Ano |
| panel/maturita/[role]/objector/index | Ne | Ano | Ano |
| panel/maturita/[role]/objector/[taskId]/[guarantorId]/[teamId]/index | Ne | Ano | Ano |
| panel/maturita/[role]/objector/[taskId]/[guarantorId]/[teamId]/chat | Ne | Ano | Ano |
| panel/maturita/[role]/tables/index | Ne | Ano | Ano |
| panel/maturita/[role]/tables/evaluators | Ne | Ano | Ano |
| panel/users/index | Ano | Ano | Ano |
| panel/users/add | Ne | Ne | Ano |
| panel/users/student/index | Ano | Ano | Ano |
| panel/users/student/[class]/index | Ano | Ano | Ano |
| panel/users/student/[class]/edit | Ne | Ne | Ano |
| panel/users/student/[class]/remove | Ne | Ne | Ano |
| panel/users/[role]/index | Ano | Ano | Ano |
| panel/users/[role]/edit/index | Ne | Ne | Ano |
| panel/users/[role]/edit/[id] | Ne | Ne | Ano |
| panel/users/[role]/remove | Ne | Ne | Ano |
| panel/settings/index | Ano | Ano | Ano |
| panel/settings/customization | Ano | Ano | Ano |
| panel/settings/security | Ano | Ano | Ano |

Testováno bylo také chování aplikace po vypršení přihlašovací relace.

### Testování responzivity rozhraní

Responzivita byla testována pomocí nástrojů pro vývojáře v prohlížeči na breakpointech: mobilní telefon, tablet a desktop. Hlavní pozornost byla věnována:

- Postrannímu menu (automaticky se skrývá na menších obrazovkách)
- Tabulkám (horizontální posouvání při menších rozlišeních)
- Tlačítkům a formulářovým prvkům (zalamování, zabránění přetékání)

Aplikace byla testována i na reálném mobilním zařízení pro ověření dotykového ovládání a zobrazení softwarové klávesnice.

---

## Zhodnocení výsledku

Tato podkapitola shrnuje výsledky celého projektu z širšího pohledu. Nezaměřuje se na konkrétní technická řešení, ale hodnotí projekt jako celek – co se povedlo naplnit, kde jsou rezervy, co by bylo vhodné udělat jinak a jakým směrem by bylo možné aplikaci dále rozvíjet.

### Co se povedlo

Výsledná aplikace splnila hlavní cíl – vznikl funkční, přehledný systém, který pokrývá celý průběh maturitní práce od návrhu tématu až po hodnocení a zároveň slouží ke správě úkolů a komunikaci. Na škole dosud žádný takový nástroj neexistoval a stávající obecné platformy tento proces dostatečně nepokrývaly.

Z hlediska vývoje se povedlo udržet rozsáhlý projekt organizovaný a přehledný – přes sedmdesát stránek a čtyřicet pět komponent má jasnou strukturu a logické členění. Spolupráce s backendistou fungovala bez větších komplikací, rozhraní mezi frontendem a backendem bylo předem domluveno a dodrženo. Aplikace je nasazena a reálně použitelná, což je pro projekt tohoto rozsahu v rámci maturitní práce podstatný výsledek.

### Co ne úplně

Absence automatizovaných testů se během vývoje opakovaně projevila – při větších změnách nebylo jisté, zda nedošlo k rozbití něčeho, co dříve fungovalo, a ověřování probíhalo ručně. Manuální testování je časově náročné a spolehlivost závisí na tom, na co si člověk vzpomene otestovat.

Chat funguje na principu opakovaného dotazování serveru namísto trvalého spojení, takže zprávy se nedoručují okamžitě a server zbytečně odpovídá i ve chvílích, kdy se nic nezměnilo. Toto řešení bylo zvoleno z důvodu jednodušší implementace, ale pro reálné nasazení by bylo vhodné ho přepracovat.

Rozsah projektu se během vývoje rozrostl nad původní předpoklad, což vedlo k tomu, že některé části vznikaly ve spěchu a nejsou dotaženy do stejné kvality jako části řešené s větším časovým prostorem.

### Co bys udělal jinak

Lépe bych odhadl rozsah projektu na začátku a podle toho rozvrhl čas. Automatizované testy bych zahrnul od prvních stránek, ne až zpětně – jakmile aplikace dosáhne určité velikosti, psaní testů dodatečně je výrazně náročnější. Víc bych se soustředil na to, aby klíčové části (přihlašování, přístupová práva, komunikace s backendem) měly jednotné a konzistentní řešení hned od začátku, místo aby každá stránka řešila stejné situace po svém.

### Co by šlo rozšířit

- **PWA (Progressive Web App)** – přidáním service workeru a webového manifestu by se aplikace dala nainstalovat jako samostatná aplikace na počítač i mobilní zařízení. Service worker by zároveň umožnil základní offline režim: prohlížení dříve načtených dat i bez připojení k internetu, s automatickou synchronizací po jeho obnovení.
- **Real-time komunikace** – nahrazení pollingu v chatu technologií WebSocket by přineslo okamžité doručení zpráv a výrazně snížilo zátěž serveru. Stejný mechanismus by šel využít pro živé notifikace o změnách stavu návrhů nebo nových úkolech bez nutnosti obnovovat stránku.
- **Push notifikace** – pomocí Web Push API by bylo možné upozornit uživatele i ve chvíli, kdy aplikaci nemá otevřenou, například o blížícím se termínu odevzdání nebo o schválení návrhu tématu.
- **Generování PDF** – přímé vytváření dokumentů v aplikaci (zadání maturitní práce, hodnotící listy) bez nutnosti exportovat data a formátovat je externě by výrazně zjednodušilo práci garantů i administrátorů.

---

## Závěr

*(Seznam ilustrací, seznam tabulek a seznam použitých zdrojů a literatury jsou součástí tištěné verze práce.)*
