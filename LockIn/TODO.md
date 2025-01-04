# TODO List

## Features

- Komentarze i reakcje do buildów
- moje/zapisane buildy
- Filtrowanie buildów po championie i twórcy (czekamy na back)
- Sortowanie buildów po dacie utworzenia (czekamy na back)

- Messenger: (prywatne czaty tworza sie automatyzcnie po dodaniu kogos do znajomych, publiczne sa tworzone przez uzytkownikow)
- tworzenie chatu publicznego z kilkoma osobami ktore osoba tworzaca ma na swojej liscie znajomych
- dodawanie ludzi do chatu publicznego (wybor z osob ktore ma na liscie znajomych)
- opuszczanie chatu publicznego
- odpowiedzi na wiadomosci
- ladowanie wiecej niz 5 wiad
- co jak jest rozmowa i wyslecie sobie 5+ wiad
  2 ostatnie zrobimy ze wyswietla 10 wiad (albo tyle ile sie miesci na ekranie) i jak scrollujesz do gory to mozesz kliknac zaladuj wiecej, albo auto fetch

- Kursy
- Ogłoszenia
- Powiadomienia (jest ale zapisuja sie w pamieci urzadzenia i jak przelogujesz sie to zostaja te same)

## Enhancements

- Przetestować i ewentualnie poprawić działanie tłumaczeń
- Cofanie z listy wyslanych zapro (cofanie na poprzedni ekran)
- Jak zaproszenie jest juz wyslane to inny guzik (ekran konta LockIn)

## Bugs

(NOBRIDGE) WARN i18next: init: i18next is already initialized. You should call init just once!

- usuwanie z listy znajomych (działa, ale nie ma na to websocketa)

{
"\_id": "8f248487-479c-40e8-902f-a9a3509eba5f",
"name": "nazwa",
"privateChat": false,
"members": [
{
"username": "test2000",
"nickname": null
},
{
"username": "Test1234",
"nickname": null
},
{
"username": "test1000",
"nickname": null
}
],
"messages": null,
"lastMessage": {
"\_id": "ce2d4454-eb38-45e1-8307-2fdadedb9f27",
"chatId": "8f248487-479c-40e8-902f-a9a3509eba5f",
"userId": "test2000",
"respondingTo": "4c03a981-2381-45cb-baef-94130b61225d",
"message": "odpowiedz",
"timestamp": 1734101478
},
"totalMessages": 3,
"timestamp": 1734101365
}

"privateChat": false ?
"messages": null ?
"timestamp": 1734101365 ? data utworzenia chatu?

## Notes
