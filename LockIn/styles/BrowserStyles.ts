import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#131313',
    height: '100%',
  },
  loadingContainer: {
    backgroundColor: '#131313',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
    textAlign: 'center',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
    marginLeft: 10,
  },
  answerText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
    fontSize: 16,
  },
  noAnswersText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
    color: '#131313',
    fontSize: 16,
  },
  welcomeText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  buttonContainerDuo: {
    fontFamily: 'Chewy-Regular',
    marginTop: 10,
    marginBottom: 0,
  },
  applyButton: {
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
  },
  textInput: {
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
    fontSize: 18,
  },
  dateText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
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
    width: 40,
    height: 40,
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
    height: 20,
    marginRight: 5,
  },
  positionsText: {
    marginTop: 5,
    marginBottom: 15,
  },
  modalTitle: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
    fontSize: 28,
    marginVertical: 20,
    textAlign: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#131313',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
    fontSize: 28,
    marginBottom: 10,
  },
  bioText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
  },
  sectionTitle: {
    color: '#F5B800',
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
    fontSize: 16,
  },
  serverText: {
    color: '#F5B800',
    fontFamily: 'Chewy-Regular',
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
    fontFamily: 'Chewy-Regular',
    fontSize: 16,
  },
  accountListContainer: {
    width: '100%',
    marginTop: 15,
    padding: 10,
  },
  accountListHeader: {
    color: '#F5B800',
    fontFamily: 'Chewy-Regular',
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
    marginTop: 20,
    marginBottom: 20,
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
    fontFamily: 'Chewy-Regular',
  },
  profileImageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
})

export default styles
