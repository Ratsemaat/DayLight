# DayLight

Veebirakendus kalkuleerimimaks päikesetõusu ja loojangut erinevatel koordinaatidel ja kuupäevadel. Kasutaja saab sisestada koordinaadid nii kaardil kui ka käsitsi EPSG:4326 süsteemis. Lisaks on võimalus näha kuni aasta lõikes vastava asukoha päikeselise aja muutumist graafikul.

Kogu töö peale kulus ligikaudu 24 tundi. Jaotasin oma protsessi kolme erinevasse faasi. Esimene faas tegelesin 1, 2 ja 3 ülesandega. Teises faasis tegin asju ilusamaks ning kolmandas faasis korrastasin ja lisasin natuke lisafunktsionaalsust.

24 tunnist kulus kaardi ja koordinaatide põhjal päikselise aja arvutamise ning päikesetõusu-loojangu kuvamise implementeerimiseks 6 tundi. Graafiku lisamine ja elementaarne vormistamine võttis 4h. Kõige raskem oli muutujate skoobi üle otsustamine. Kui palju anda javascripti funktsioonides parameetritega kaasa - mille kohta saada info html-ist. Näiteks tahtsin, et kaardil olev markeri ja tekstiväljal olevad koordinaadid osutaksid alati samale kohale. Muutes koordinaate manuaalselt ei olnud kuidagi võimalik uuendada meetodivälist muutujat. Lõpuks otsustasin teha markeri globaalseks ning siis ei olnud enam marker tundamatu.

Väga palju(u 8h) kulus veebilehe kaunimaks tegemisele. Olin varasemalt SemanticUI kasutanud ning tahtsin ka selles projektis seda oskust rakendada. SemanticUI peaks tegema portimise telefonidele ja tahvlitele lihtsamaks, kuid ei jõudnud seda ise testida. Disainimisel hakkasin varakult lähtuma sellest, et leht oleks kasutatav sõltumata kasutaja keelest. Ehk proovisin kasutada ainult ikoone, värve ja kiiret tagasisidet, et õpetada kasutajale minu rakendust kasutama. Kogu 8h sees oli palju erinevaid väikseid probleeme, mille lahendamiseks läks 30-40 min googeldamist/mõtlemist. Enim valmistas probleeme veebilehe suuruse dünaamiliseks tegemine. Nii kaart kui ka graafik ei tahtnud sisse-välja zoomimisel säilitada suuruste suhet teiste elementidega. Lõpuks sai mõlemad pandud omaette containerisse ning määratud nendes konteinerites asukoht absoluutselt ära ning containerid ise olid suhteliselt siis Semanticu abil loodud raamistikus.

Kui lõpuks disainiga rahule jäin, refaktoreerisin oma koodi ja lisasin kommentaare. ca 1.5h. Seejuures mõtlesin lõpuks välja missugune lisafunktsionaalsust tahan lisada. Soovisin muuta graafikut niimoodi, et ka päikesetõusu ja -loojangu ajad oleks visuaalselt nähtavad. Kulus 3.5h. Palju pahandust oli polaarpiirkondadega. Kuna seal võis UTC ajamääratluse järgi päikeseloojang olla enne päikesetõusu, siis mu graafik läks veel päris lõpus teatud sisenditel katki. Lahenduseks lisasin graafikusse uue dataseti, mis võimaldas ka ööpäevas kahte eraldiseisvat päikeselist perioodi.
Umbes tund kulus kõige kõrvalt dokumenteerimisele.

Oli väga põnev ja hariv praktikatöö. Aitäh :D

Rakenduses on kasutatud alljärgenaid viitamist nõudvaid tarkvarasid:
SunCalc https://github.com/mourner/suncalc
Leaflet.js https://leafletjs.com/
Nikita Golubevi ikoonid flaticonist. https://www.flaticon.com/authors/nikita-golubev
Chart.js https://github.com/chartjs/awesome/blob/master/LICENSE
