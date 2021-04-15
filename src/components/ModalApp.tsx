import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Image, Pressable } from 'react-native';

interface ModalAppProps {
  show: boolean;
  close: Function;
  //showTitle: boolean;
  title?: string;
  //showDescription: boolean;
  description?: string;
  imgSuccess: boolean;
  imgError: boolean;
  btnBack: boolean;
  route: string;
}

export default function AppModal({ 
  show, 
  close, 
  //showTitle, 
  title, 
  //showDescription, 
  description, 
  imgSuccess, 
  imgError, 
  btnBack,
  route}: 
  ModalAppProps) {

  const [modal, setModal] = useState(false);

    useEffect(() => {
      setModal(show);
     }, [show]);

      return (
        <View style={styles.modalContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            close(!modal);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}> 
            {imgSuccess && <Image style={styles.modalImage} source={require('../images/modal-images/sucesso.png')}  />}
            {imgError && <Image style={styles.modalImage} source={require('../images/modal-images/erro.png')} /> }
            {title && <Text style={styles.modalTitle}>{title}</Text> }
            {description && <Text style={styles.modalText}>{description}</Text>} 
              <Pressable
                style={styles.modalButton}
                onPress={() => {close(!modal); { }}} //colocar função para alterar a tela aqui -> route
              >
                <Text style={styles.modalButtonText}>Ok</Text>
              </Pressable>
              
                {btnBack && <Pressable
                style={styles.modalButton}
                onPress={() => close(!modal)}
                >
                <Text style={styles.modalButtonText}>Voltar</Text>
                </Pressable> }
              
            </View>
          </View>
        </Modal>
      </View>
    )
}

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      },
    
      modalView: {
        margin: 20,
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
        fontSize: 20,
      },
    
      modalText: {
        marginTop: 10,
        marginBottom: 20,
        textAlign: "center",
        color: "#000",
        fontFamily: 'Abel_400Regular',
        fontSize: 18,
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
        fontSize: 18,
      },
})