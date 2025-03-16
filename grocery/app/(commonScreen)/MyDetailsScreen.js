import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Title, Provider as PaperProvider, DefaultTheme, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../constent/Colors';
import CustomFonts from '../../constent/customeFonts';
import CustomInput from '../../component/CustomInput';
import { updateProfileThunk, changePasswordThunk, resetError } from '../../utils/authSlice';
import SuccessDialog from '../../component/SuccessDialog';
import ErrorDialog from '../../component/ErrorDialog';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.Primary,
    },
};

export default function MyDetailsScreen() {
    const dispatch = useDispatch();
    const { user, error } = useSelector((state) => state.auth);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.username);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            setErrorDialogVisible(true);
        }
    }, [error]);

    const handleSave = async () => {
        try {
            if (name !== user.username) {
                await dispatch(updateProfileThunk(name)).unwrap();
            }

            if (newPassword) {
                await dispatch(changePasswordThunk({ currentPassword, newPassword })).unwrap();
            }

            setDialogVisible(true);
            console.log('Details saved:', { name, email, currentPassword, newPassword });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    const hideErrorDialog = () => {
        setErrorDialogVisible(false);
        dispatch(resetError());
    };

    return (
        <PaperProvider theme={theme}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>My Details</Title>
                        <CustomInput
                            label="Name"
                            value={name}
                            onChangeText={text => setName(text)}
                            placeholder="Enter your name"
                        />
                        <CustomInput
                            label="Email"
                            value={email}
                            placeholder="Enter your email"
                            isPassword={false}
                            editable={false}
                        />
                        <CustomInput
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={text => setCurrentPassword(text)}
                            placeholder="Enter your current password"
                            secureTextEntry
                            isPassword
                        />
                        <CustomInput
                            label="New Password"
                            value={newPassword}
                            onChangeText={text => setNewPassword(text)}
                            placeholder="Enter your new password"
                            secureTextEntry
                            isPassword
                        />
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                        >
                            Save Changes
                        </Button>
                    </Card.Content>
                </View>
                <SuccessDialog
                    visible={dialogVisible}
                    onDismiss={hideDialog}
                    title="Success"
                    message="Your profile has been updated successfully."
                />
                <ErrorDialog
                    visible={errorDialogVisible}
                    onDismiss={hideErrorDialog}
                    title="Error"
                    message="Error changing password. Current password is incorrect."
                />
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.Secondary,
        padding: 16,
    },
    card: {
        backgroundColor: Colors.Secondary,
        marginBottom: 16,
        marginTop: 16,
    },
    title: {
        fontSize: 24,
        color: Colors.Primary,
        fontFamily: CustomFonts.Gilroy_ExtraBold,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: Colors.Primary,
        marginTop: 10,
    },
    buttonLabel: {
        color: Colors.Secondary,
        fontFamily: CustomFonts.Lato_Bold,
    },
});