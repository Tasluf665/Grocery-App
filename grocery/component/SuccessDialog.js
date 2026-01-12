import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';
import Colors from '../constent/Colors';

const SuccessDialog = ({ visible, onDismiss, title, message }) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
                <Dialog.Icon icon="check-circle" size={50} color={Colors.Primary} />
                <Dialog.Title style={styles.dialogTitle}>
                    {title}
                </Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.dialogText}>
                        {message}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: 'center' }}>
                    <TouchableOpacity
                        style={styles.dialogButton}
                        onPress={onDismiss}
                    >
                        <Text style={{ color: "white", fontSize: 16 }}>Done</Text>
                    </TouchableOpacity>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialog: {
        borderRadius: 10,
        backgroundColor: 'white',
    },
    dialogTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.DarkGray
    },
    dialogText: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.DarkGray
    },
    dialogButton: {
        backgroundColor: Colors.Primary,
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 5,
    }
});

export default SuccessDialog;