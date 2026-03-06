import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  fullWidth: {
    width: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  paddingNav: {
    paddingBottom: 140,
  },

  common2BtnHStackContainer: {
    flex: 50,
  },

  hastckContainer: {
    width: '100%',
    alignItems: 'center',
    // backgroundColor: '#333',
  },

  headerBar: {
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    textAlign: 'center'
  },


  navigatorBar: {
    height: 50,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navigatorBtnContainer: {
    flex: 33,
    justifyContent: 'center', 
    alignItems: 'center',
  },
   navigatorBtnContainerSelected: {
    backgroundColor: '#fefefe',
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 10,
    width: '80%',
  },
  navigatorText: {
    textAlign: 'center'
  },

  modalBackground: {
      flex: 1,
      justifyContent: 'center', // Centers content vertically
      alignItems: 'center',    // Centers content horizontally
      backgroundColor: 'rgba(0, 0, 0, 0.2)', 
  },
  commonModalTitleContainer: {
      backgroundColor: '#4A4A4A',
      paddingVertical: 5,
      width: '80%',
      borderTopStartRadius: 5,
      borderTopEndRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
  },
  commonModalTitleLabel: {
      color: '#FFFFFF',
      fontSize: 18,
      textAlign: 'center',
  },
  commonModalContainer: {
      backgroundColor: '#FFFFFF',
      height: '20%',
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  commonModalMessageLabel: {
      fontSize: 16, 
      color: '#333333',
      textAlign: 'center',
  },
  twoBtnRowContainer: {
      backgroundColor: '#4A4A4A',
      flexDirection: 'row',
      width: '80%',
      borderBottomStartRadius: 5,
      borderBottomEndRadius: 5,
  },
  common2BtnModalBtnContainer: {
    flex: 50,
    paddingVertical: 10,
  },
  common2BtnModalBtnLabel: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  commonModalListContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  closeBtnRowContainer: {
      backgroundColor: '#4A4A4A',
      flexDirection: 'row',
      width: '80%',
      borderBottomStartRadius: 5,
      borderBottomEndRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
  },
  closeBtnRowBtnContainer: {
    flex: 100,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },


  homeMapContainer: {
    flex: 60,
    height: 400,
  },
  homeContentContainer: {
    flex: 40,
  },
  homeExpendChevronContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
  },

  infoPageSubNavContainer: {
    flex: 33,
  },
  infoPageSubNavBtn: {
    width: '100%',
    height: 50,
  },
  infoPageSubNavText: {
    textAlign: 'center'
  },

  listItemContainerLeft: {
    width: '29%',
    textAlign: 'left',
  },
  listItemContainerColon: {
    width: '2%',
    textAlign: 'center',
  },
  listItemContainerRight: {
    width: '69%',
    textAlign: 'left',
  },

  mapMarkerControlPanelRowContainer: {
    width: '100%',
    alignItems: 'center',
  },

  bottomBorderContainer: {
    width: '100%',
    borderBottomColor: '#333',
    borderBottomWidth: 0.5,
  },

  homeViewWeatherInfoCentreLabel: {
    textAlign: 'center',
  },
  homeViewWeatherInfoContainer: {
    borderWidth: 1, 
    borderColor: 'gray', 
    borderRadius: 4, 
    padding: 8, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
})