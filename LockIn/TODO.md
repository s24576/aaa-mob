# TODO List

## Features

Rejestracja

- zapomniales hasla (mailem nowe haslo przychodzi) !Po froncie już powinno działać, czekamy na szefa!

Profile Lockin

- zmien haslo
- zmien email
- ustaw profilowe
- ustaw bio
- ustaw username (default to id chyba ale moze tego nie trzeba ALE wydaje mi sie ze trzeba dodac)
- match history z wszsytkich claimed accounts sortowane po timestampie
- potwierdzanie konta (kod z maila [+ resend?])
- Jak zaproszenie jest juz wyslane to inny guzik (ekran konta LockIn)

Lista znajomych

- auto refresh listy znaj on websocket (nie bylo na to websocketa, mozliwe ze trzeba dodac)
- anulowanie wyslanego zaproszenia

Zaproszenia do znajomych

- input jak na logine
- wyswietlanie tylko nicku nie zalogowanego usera
- strzalka na powrot do listy znaj

Buildy

- dodac summonery
- dodac date utworzenia
- filtrowanie po pozycji
- usuwanie buildow z zapisanych i "moich"
- zmiana guzika gdy polubione juz jest

Reporty

- dodac reportowanie kont lockin (na profilu + kom [ew. chat])

Kursy

- dodac odpowiedzi do komentarzy
- zmiana guzika gdy polubione juz jest
- dodawanie kursów (nw czy to zrobimy)
- my courses (utworzone przez ciebie, czy kupione?){szef musi poprawic ale huj wie co i czy juz jest}

Ogłoszenia

- guzik do wysylania zaproszenia do znajomych, accept dodaje do znajomych lockin (wyswietlasz tez chyba nazwe konta riotowego z ogloszenia)
- websocket na to wyzej
- dodac widok do zaproszen z duo

Messenger

- dodac: klik na uczestnika czatu przenosi na jego profil lockin
- refreshe wiad nie dzialaja po doladowaniu/wyslaniu
- ulozenie loading ikonki
- stylowanie odpowiedzi

Powiadomienia

- deleteNotification:
- on click z przeniesieniem do zaproszeń
- X do kasacji masowej

Tłumaczenia

- zaczać pisanie słownika i stosowanie go

## Enhancements

## Bugs

(NOBRIDGE) WARN i18next: init: i18next is already initialized. You should call init just once!

- websocket msgr na czlonkow: jest ale nic nie robi na razie xd

## Notes

- wyswietlanie rzeczy z szarą ramką
- input zloty (na zaproszeniach)

1. anulowane zapro

- req
- lista

2. zaakceptowane zapro

- req nie odswieza sie
- lista nie odswieza sie

3. nowe zapro

- req