import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  buttonGroup3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    gap: 10,
    padding: 10,
},
customButton3: {
  backgroundColor: '#F5B800',
  fontFamily: 'PoetsenOne-Regular',
  paddingVertical: 10,
  borderRadius: 10,
  borderColor: '#F5B800',
  borderWidth: 1,
  margin: 5,
  alignItems: 'center',
  minWidth: 100, 
  flexGrow: 1,
  flexBasis: '30%',
},
  container: {
    backgroundColor: '#131313',
    height: '100%',
  },
  loadingContainer: {
    backgroundColor: '#131313',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontFamily: 'PoetsenOne-Regular',
    textAlign: 'center',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 24,
  },
  scrollViewContainer: {
    paddingBottom: 80,
  },
  answerContainer: {
    marginBottom: 20,
    borderBottomColor: '#F5B800',
    borderBottomWidth: 1,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  answerTitle: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 20,
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  profileContents: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#F5B800',
    marginBottom: 15,
  },
  profileText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    marginLeft: 10,
  },
  answerText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    marginBottom: 5,
  },
  rankImage: {
    width: 50,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  acceptButton: {
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  acceptButtonText: {
    color: '#131313',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  rejectButton: {
    backgroundColor: '#13131313',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
  },
  rejectButtonText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  noAnswersText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#131313',
    padding: 10,
  },
  pageNumber: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
  },
  serverName: {
    maxWidth: '25%',
  },
  customButton2: {
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
  },
  customButton2Text: {
    fontFamily: 'PoetsenOne-Regular',
    color: '#131313',
    fontSize: 16,
  },
  welcomeText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: '#131313',
    padding: 15,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    width: '80%',
    maxHeight: '80%',
  },
  option: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#F5F5F5',
  },
  selectedOption: {
    color: '#F5B800',
  },
  customButton: {
    backgroundColor: '#13131313',
    fontFamily: 'PoetsenOne-Regular',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
  },
  customButtonText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontFamily: 'PoetsenOne-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  buttonContainerDuo: {
    fontFamily: 'PoetsenOne-Regular',
    marginTop: 10,
    marginBottom: 0,
  },
  applyButton: {
    fontFamily: 'PoetsenOne-Regular',
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 80,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#131313',
    fontSize: 16,
    fontFamily: 'PoetsenOne-Regular',
  },
  textInput: {
    fontFamily: 'PoetsenOne-Regular',
    backgroundColor: '#1E1E1E',
    color: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    marginVertical: 10,
  },
  duoContainer: {
    padding: 15,
    borderRadius: 10,
    borderBottomColor: '#F5B800',
    borderBottomWidth: 1,
  },
  duoText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    marginBottom: 5,
  },
  championContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  championItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  rankImageDuo: {
    width: 30,
    height: 30,
  },
  authorText: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
  },
  dateText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
  },
  positionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  rankImageLarge: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  positionImageLarge: {
    width: 30,
    height: 30,
  },
  championImageLarge: {
    width: 30,
    height: 30,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  languageFlag: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  profileIcon: {
    width: 50,
    height: 50,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  positionsText: {
    marginTop: 5,
    marginBottom: 15,
  },
  modalTitle: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  modalOptionText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  tileButton: {
    width: '90%',
    height: 200,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: 'center',
  },
  tileButtonText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    width: '100%',
  },
  homeContainer: {
    padding: 10,
    alignItems: 'center',
    paddingBottom: 120,
  },
  welcomeHeader: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 28,
    marginVertical: 20,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
  searchContainer: {
    backgroundColor: '#131313',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#F5B800',
    color: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
    backgroundColor: '#1E1E1E',
  },
  searchButton: {
    backgroundColor: '#F5B800',
    padding: 12,
    borderRadius: 12,
    marginLeft: 10,
    elevation: 3,
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchButtonDisabled: {
    backgroundColor: '#3D3D3D',
    opacity: 0.7,
  },
  serverSelector: {
    borderWidth: 1,
    borderColor: '#F5B800',
    color: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
    backgroundColor: '#1E1E1E',
    marginBottom: 10,
  },
  userProfileContainer: {
    flex: 1,
    backgroundColor: '#131313',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  username: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 28,
    marginBottom: 10,
  },
  bioText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#F5B800',
    borderRadius: 12,
    padding: 12,
    color: '#F5F5F5',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    fontFamily: 'PoetsenOne-Regular',
  },
  sectionTitle: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 22,
    marginVertical: 15,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F5B800',
  },
  accountInfo: {
    flex: 1,
    marginLeft: 10,
  },
  accountName: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  serverText: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#F5B800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#131313',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  accountListContainer: {
    width: '100%',
    padding: 10,
  },
  accountListHeader: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  bioContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
  removeButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#FF4444',
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
  },
  profileImageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  friendListContainer: {
    backgroundColor: '#131313',
    padding: 20,
  },
  friendRequestsButton: {
    backgroundColor: '#F5B800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  friendListHeader: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 24,
    marginBottom: 15,
    textAlign: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
  },
  friendName: {
    flex: 1,
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
  },
  friendRequestsContainer: {
    backgroundColor: '#131313',
  },
  searchBarContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#F5B800',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInputFR: {
    flex: 1,
    backgroundColor: '#131313',
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F5B800',
  },
  requestsSection: {
    marginTop: 20,
    padding: 15,
  },
  requestsSectionTitle: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
  },
  requestName: {
    flex: 1,
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptRequestButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  declineRequestButton: {
    backgroundColor: '#FF4444',
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  emptyListText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  // Add new message styles
  messageContainer: {
    backgroundColor: '#131313',
    flex: 1,
  },
  chatHeader: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#F5B800',
  },
  chatTitle: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 24,
  },
  chatMembers: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 14,
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 10,
    marginVertical: 5,
    maxWidth: '85%',
    borderColor: '#F5B800',
    borderWidth: 1,
  },
  messageOwn: {
    alignSelf: 'flex-end',
    backgroundColor: '#2A2A2A',
  },
  messageOther: {
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  messageTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'PoetsenOne-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    color: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontFamily: 'PoetsenOne-Regular',
    borderColor: '#F5B800',
    borderWidth: 1,
  },
  sendButton: {
    backgroundColor: '#F5B800',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#2A2A2A',
  },
  replyContainer: {
    borderRadius: 8,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyText: {
    color: '#888',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 14,
  },
  chatListContainer: {
    backgroundColor: '#131313',
    padding: 15,
    height: '100%',
  },
  chatItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
  },
  chatItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  lastMessage: {
    color: '#888',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 14,
  },
  createChatButton: {
    backgroundColor: '#F5B800',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  createChatText: {
    color: '#131313',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
  },
  modalHeader: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalWrapper: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    borderColor: '#F5B800',
    borderWidth: 2,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    alignSelf: 'center',
  },
  modalInput: {
    backgroundColor: '#131313',
    color: '#F5F5F5',
    borderColor: '#F5B800',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  modalListContainer: {
    marginBottom: 15,
  },
  modalItemContainer: {
    backgroundColor: '#131313',
    borderRadius: 10,
    padding: 12,
    margin: 4,

    borderColor: '#F5B800',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalItemText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonPrimary: {
    backgroundColor: '#F5B800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 0.48,
  },
  modalButtonSecondary: {
    backgroundColor: '#131313',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 0.48,
    borderColor: '#F5B800',
    borderWidth: 1,
  },
  modalButtonText: {
    color: '#131313',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtonTextSecondary: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  modalConfirmText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    margin: 8,
    borderColor: '#F5B800',
    borderRadius: 5,
  },
  notificationsContainer: {
    backgroundColor: '#131313',
    padding: 15,
  },
  notificationsHeader: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 24,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  notificationItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
  },
  notificationText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#131313',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  courseCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#F5B800',
    borderWidth: 1,
    borderBottomWidth: 2,
  },
  courseThumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  courseTitle: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 22,
    marginBottom: 5,
  },
  courseDescription: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
    marginBottom: 10,
  },
  courseAuthor: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  coursePrice: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
    marginTop: 5,
  },
  videoButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    borderColor: '#F5B800',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoButtonText: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
  },
  courseDetailsContainer: {
    padding: 15,
    backgroundColor: '#131313',
  },
  courseHeaderImage: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  courseDetailTitle: {
    color: '#F5B800',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 26,
    textAlign: 'center',
    marginVertical: 15,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  courseDetailsScroll: {
    backgroundColor: '#131313',
    flex: 1,
  },
  courseDetailHeaderContainer: {
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 2,
    borderBottomColor: '#F5B800',
    paddingBottom: 15,
  },
  courseDetailImage: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  courseDetailTitleContainer: {
    padding: 15,
    marginTop: 10,
  },
  courseDetailAuthor: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  courseDetailDescription: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  courseStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  courseVideosContainer: {
    padding: 15,
    backgroundColor: '#131313',
  },
  courseVideoButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 15,
    marginVertical: 6,
    borderColor: '#F5B800',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseVideoTitle: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  courseVideoIcon: {
    width: 40,
  },
  purchaseContainer: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    margin: 15,
    borderRadius: 12,
    borderColor: '#F5B800',
    borderWidth: 1,
    alignItems: 'center',
  },
  purchaseButton: {
    backgroundColor: '#F5B800',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  purchaseButtonText: {
    color: '#131313',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 18,
    marginLeft: 10,
  },
  purchaseMessage: {
    color: '#F5F5F5',
    fontFamily: 'PoetsenOne-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default styles
