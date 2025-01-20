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
    width: 50,
    height: 50,
    borderRadius: 25,
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
})

export default styles
