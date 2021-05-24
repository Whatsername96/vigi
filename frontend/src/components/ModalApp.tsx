import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ModalAppProps {
  show: boolean;
  close: Function;
  title?: string;
  description?: string;
  imgSuccess: boolean;
  imgError: boolean;
  btnBack: boolean;
  route : string
}

export default function AppModal({
  show,
  close,
  title,
  description,
  imgSuccess,
  imgError,
  btnBack,
  route
}: ModalAppProps) {

  const [modal, setModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setModal(show);
  }, [show]);

  if (show) {
    return (

        <Modal
          animationType="fade"
          statusBarTranslucent
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            navigation.navigate(route)
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              {imgSuccess && <Image style={styles.modalImage} source={require('../images/modal-images/sucesso.png')} />}
              {imgError && <Image style={styles.modalImage} source={require('../images/modal-images/erro.png')} />}
              {title && <Text style={styles.modalTitle}>{title}</Text>}
              {description && <Text style={styles.modalText}>{description}</Text>}

              <Pressable
                style={styles.modalButton}
                onPress={() => { close(!modal); { navigation.navigate(route) } }}
              >
                <Text style={styles.modalButtonText}>Ok</Text>
              </Pressable>

              {btnBack && <Pressable
                style={styles.modalButton}
                onPress={() => { close(!modal); { navigation.navigate('Denunciar') } }}
              >
                <Text style={styles.modalButtonText}>Voltar</Text>
              </Pressable>}

            </View>
          </View>
        </Modal>

    )
  } else {
    return (<View style={{ width: 0, height: 0 }}></View>);
  }

}

const styles = StyleSheet.create({

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },

  modalView: {
    margin: 0,
    width: '70%',
    backgroundColor: "#E5E5E5",
    borderRadius: 6,
    padding: 30,
    alignItems: "center",
  },

  modalImage: {
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },

  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
    fontFamily: 'Abel_400Regular',
    fontSize: 24,
  },

  modalText: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
    fontFamily: 'Abel_400Regular',
    fontSize: 20,
  },

  modalButton: {
    backgroundColor: '#394867',
    borderRadius: 6,
    elevation: 2,
    width: '80%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  modalButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Abel_400Regular',
    fontSize: 20,
  },
})