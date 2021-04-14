import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, Modal, Pressable } from 'react-native';

interface ModalAppProps {
  show: boolean;
  close: Function;
}

export default function AppModal({ show, close }: ModalAppProps) {
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
              <Text style={styles.modalTitle}>Informações</Text>
              <Text style={styles.modalText}>Cada denúncia ficará disponível por 15 dias.</Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => close(!modal)}
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </Pressable>
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
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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
      },
    
      modalButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Abel_400Regular',
        fontSize: 18,
      }
})