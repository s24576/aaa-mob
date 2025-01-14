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
 (NOBRIDGE) LOG  STOMP Debug: Received data {"_binaryBody": [54, 55, 56, 54, 56, 48, 53, 51, 50, 98, 102, 53, 48, 54, 50, 49, 98, 101, 50, 53, 49, 54, 53, 102], "ack": [Function anonymous], "command": "MESSAGE", "escapeHeaderValues": true, "headers": {"content-length": "24", "content-type": "text/plain;charset=UTF-8", "destination": "/user/Test1234/delete/friendRequest/to", "message-id": "tzxn1ums-27", "subscription": "sub-3"}, "isBinaryBody": true, "nack": [Function anonymous], "skipContentLengthHeader": false}
- req
- lista
 (NOBRIDGE) LOG  STOMP Debug: Received data {"_binaryBody": [123, 34, 95, 105, 100, 34, 58, 34, 54, 55, 56, 54, 56, 48, 54, 100, 50, 98, 102, 53, 48, 54, 50, 49, 98, 101, 50, 53, 49, 54, 54, 48, 34, 44, 34, 102, 114, 111, 109, 34, 58, 34, 116, 101, 115, 116, 50, 48, 48, 48, 34, 44, 34, 116, 111, 34, 58, 34, 84, 101, 115, 116, 49, 50, 51, 52, 34, 44, 34, 116, 105, 109, 101, 115, 116, 97, 109, 112, 34, 58, 49, 55, 51, 54, 56, 55, 49, 53, 52, 57, 125], "ack": [Function anonymous], "command": "MESSAGE", "escapeHeaderValues": true, "headers": {"content-length": "91", "content-type": "application/json", "destination": "/user/Test1234/friendRequest/to", "message-id": "tzxn1ums-28", "subscription": "sub-1"}, "isBinaryBody": true, "nack": [Function anonymous], "skipContentLengthHeader": false}
 (NOBRIDGE) LOG  STOMP Debug: Received data {"_binaryBody": [116, 101, 115, 116, 50, 48, 48, 48, 32, 119, 121, 115, 63, 97, 63, 40, 97, 41, 32, 67, 105, 32, 122, 97, 112, 114, 111, 115, 122, 101, 110, 105, 101, 32, 100, 111, 32, 122, 110, 97, 106, 111, 109, 121, 99, 104, 46], "ack": [Function anonymous], "command": "MESSAGE", "escapeHeaderValues": true, "headers": {"content-length": "47", "content-type": "text/plain;charset=UTF-8", "destination": "/user/Test1234/notification", "message-id": "tzxn1ums-29", "subscription": "sub-0"}, "isBinaryBody": true, "nack": [Function anonymous], "skipContentLengthHeader": false}
 
2. zaakceptowane zapro

- req nie odswieza sie
- lista nie odswieza sie
  (NOBRIDGE) LOG STOMP Debug: Received data {"\_binaryBody": [54, 55, 56, 54, 55, 56, 100, 56, 50, 98, 102, 53, 48, 54, 50, 49, 98, 101, 50, 53, 49, 54, 53, 57], "ack": [Function anonymous], "command": "MESSAGE", "escapeHeaderValues": true, "headers": {"content-length": "24", "content-type": "text/plain;charset=UTF-8", "destination": "/user/Test1234/delete/friendRequest/from", "message-id": "tzxn1ums-20", "subscription": "sub-4"}, "isBinaryBody": true, "nack": [Function anonymous], "skipContentLengthHeader": false}
  (NOBRIDGE) LOG STOMP Debug: Received data {"\_binaryBody": [54, 55, 56, 54, 55, 55, 52, 102, 50, 98, 102, 53, 48, 54, 50, 49, 98, 101, 50, 53, 49, 54, 53, 54], "ack": [Function anonymous], "command": "MESSAGE", "escapeHeaderValues": true, "headers": {"content-length": "24", "content-type": "text/plain;charset=UTF-8", "destination": "/user/Test1234/delete/friendRequest/from", "message-id": "tzxn1ums-22", "subscription": "sub-4"}, "isBinaryBody": true, "nack": [Function anonymous], "skipContentLengthHeader": false}
  (NOBRIDGE) LOG STOMP Debug: Received data {"\_binaryBody": [116, 101, 115, 116, 51, 48, 48, 48, 32, 122, 97, 97, 107, 99, 101, 112, 116, 111, 119, 97, 63, 40, 97, 41, 32, 116, 119, 111, 106, 101, 32, 122, 97, 112, 114, 111, 115, 122, 101, 110, 105, 101, 32, 100, 111, 32, 122, 110, 97, 106, 111, 109, 121, 99, 104, 46], "ack": [Function anonymous], "command": "MESSAGE", "escapeHeaderValues": true, "headers": {"content-length": "56", "content-type": "text/plain;charset=UTF-8", "destination": "/user/Test1234/notification", "message-id": "tzxn1ums-23", "subscription": "sub-0"}, "isBinaryBody": true, "nack": [Function anonymous], "skipContentLengthHeader": false}

3. nowe zapro

- req
 (NOBRIDGE) LOG  STOMP Debug: Received data {"_binaryBody": [123, 34, 95, 105, 100, 34, 58, 34, 54, 55, 56, 54, 56, 48, 53, 51, 50, 98, 102, 53, 48, 54, 50, 49, 98, 101, 50, 53, 49, 54, 53, 102, 34, 44, 34, 102, 114, 111, 109, 34, 58, 34, 116, 101, 115, 116, 50, 48, 48, 48, 34, 44, 34, 116, 111, 34, 58, 34, 84, 101, 115, 116, 49, 50, 51, 52, 34, 44, 34, 116, 105, 109, 101, 115, 116, 97, 109, 112, 34, 58, 49, 55, 51, 54, 56, 55, 49, 53, 50, 51, 125], "ack": [Function anonymous], "command": "MESSAGE", "escapeHeaderValues": true, "headers": {"content-length": "91", "content-type": "application/json", "destination": "/user/Test1234/friendRequest/to", "message-id": "tzxn1ums-25", "subscription": "sub-1"}, "isBinaryBody": true, "nack": [Function anonymous], "skipContentLengthHeader": false}
 (NOBRIDGE) LOG  STOMP Debug: Received data {"_binaryBody": [116, 101, 115, 116, 50, 48, 48, 48, 32, 119, 121, 115, 63, 97, 63, 40, 97, 41, 32, 67, 105, 32, 122, 97, 112, 114, 111, 115, 122, 101, 110, 105, 101, 32, 100, 111, 32, 122, 110, 97, 106, 111, 109, 121, 99, 104, 46], "ack": [Function anonymous], "command": "MESSAGE", "escapeHeaderValues": true, "headers": {"content-length": "47", "content-type": "text/plain;charset=UTF-8", "destination": "/user/Test1234/notification", "message-id": "tzxn1ums-26", "subscription": "sub-0"}, "isBinaryBody": true, "nack": [Function anonymous], "skipContentLengthHeader": false}
