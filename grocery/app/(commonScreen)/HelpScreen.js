import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Linking } from 'react-native';
import { Text, Card, Title, Paragraph, Button, List, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Colors from '../../constent/Colors';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.Primary,
    },
};

export default function HelpScreen() {
    const [expandedItem, setExpandedItem] = useState(null);
    const [solutionItem, setSolutionItem] = useState(null);

    const handleItemPress = (item) => {
        setExpandedItem(expandedItem === item ? null : item);
    };

    const handleContactSupport = () => {
        Linking.openURL('mailto:taslufmorshed665@gmail.com');
    };

    return (
        <PaperProvider theme={theme}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.title}>Help & Support</Title>
                            <Paragraph style={styles.paragraph}>
                                Welcome to the Help & Support section. Here you can find answers to frequently asked questions and get in touch with our support team.
                            </Paragraph>
                        </Card.Content>
                    </Card>

                    <List.Section>
                        <List.Accordion
                            title="Account Issues"
                            left={props => <List.Icon {...props} icon="account" />}
                            expanded={expandedItem === 'account'}
                            onPress={() => handleItemPress('account')}
                            style={styles.accordion}
                        >
                            <List.Item
                                title="How to reset my password?"
                                onPress={() => {
                                    if (solutionItem === 'resetPassword') {
                                        setSolutionItem(null);
                                    }
                                    else {
                                        setSolutionItem('resetPassword');
                                    }
                                }}
                            />
                            {solutionItem === 'resetPassword' && (
                                <View style={styles.solutionContainer}>
                                    <Text style={styles.solutionText}>
                                        To reset your password, go to the login screen and click on "Forgot Password". Enter your email address and follow the instructions sent to your email to reset your password.
                                    </Text>
                                </View>
                            )}
                            <List.Item
                                title="How to change my email address?"
                                onPress={() => {
                                    if (solutionItem === 'changeEmail') {
                                        setSolutionItem(null);
                                    }
                                    else {
                                        setSolutionItem('changeEmail');
                                    }
                                }}
                            />
                            {solutionItem === 'changeEmail' && (
                                <View style={styles.solutionContainer}>
                                    <Text style={styles.solutionText}>
                                        To change your email address, go to the account settings and update your email information. You may need to verify your new email address.
                                    </Text>
                                </View>
                            )}
                            <List.Item
                                title="How to delete my account?"
                                onPress={() => {
                                    if (solutionItem === 'deleteAccount') {
                                        setSolutionItem(null);
                                    }
                                    else {
                                        setSolutionItem('deleteAccount');
                                    }
                                }}
                            />
                            {solutionItem === 'deleteAccount' && (
                                <View style={styles.solutionContainer}>
                                    <Text style={styles.solutionText}>
                                        To delete your account, go to the account settings and select "Delete Account". Follow the instructions to permanently delete your account.
                                    </Text>
                                </View>
                            )}
                        </List.Accordion>

                        <List.Accordion
                            title="Order Issues"
                            left={props => <List.Icon {...props} icon="cart" />}
                            expanded={expandedItem === 'order'}
                            onPress={() => handleItemPress('order')}
                            style={styles.accordion}
                        >
                            <List.Item
                                title="How to track my order?"
                                onPress={() => {
                                    if (solutionItem === 'trackOrder') {
                                        setSolutionItem(null);
                                    }
                                    else {
                                        setSolutionItem('trackOrder');
                                    }
                                }}
                            />
                            {solutionItem === 'trackOrder' && (
                                <View style={styles.solutionContainer}>
                                    <Text style={styles.solutionText}>
                                        You can track your order by logging into your account and navigating to the 'Orders' section. Click on the order you want to track to see the current status and tracking information.
                                    </Text>
                                </View>
                            )}
                            <List.Item
                                title="How to cancel my order?"
                                onPress={() => {
                                    if (solutionItem === 'cancelOrder') {
                                        setSolutionItem(null);
                                    }
                                    else {
                                        setSolutionItem('cancelOrder');
                                    }
                                }}
                            />
                            {solutionItem === 'cancelOrder' && (
                                <View style={styles.solutionContainer}>
                                    <Text style={styles.solutionText}>
                                        To cancel your order, go to the 'Orders' section, select the order you want to cancel, and click on the 'Cancel Order' button. Please note that orders can only be canceled before they are shipped.
                                    </Text>
                                </View>
                            )}
                            <List.Item
                                title="How to return an item?"
                                onPress={() => {
                                    if (solutionItem === 'returnItem') {
                                        setSolutionItem(null);
                                    }
                                    else {
                                        setSolutionItem('returnItem');
                                    }
                                }}
                            />
                            {solutionItem === 'returnItem' && (
                                <View style={styles.solutionContainer}>
                                    <Text style={styles.solutionText}>
                                        To return an item, go to the 'Orders' section, select the order containing the item you want to return, and click on the 'Return Item' button. Follow the instructions to complete the return process.
                                    </Text>
                                </View>
                            )}
                        </List.Accordion>

                        <List.Accordion
                            title="Payment Issues"
                            left={props => <List.Icon {...props} icon="credit-card" />}
                            expanded={expandedItem === 'payment'}
                            onPress={() => handleItemPress('payment')}
                            style={styles.accordion}
                        >
                            <List.Item
                                title="How to update my payment method?"
                                onPress={() => {
                                    if (solutionItem === 'updatePayment') {
                                        setSolutionItem(null);
                                    }
                                    else {
                                        setSolutionItem('updatePayment');
                                    }
                                }}
                            />
                            {solutionItem === 'updatePayment' && (
                                <View style={styles.solutionContainer}>
                                    <Text style={styles.solutionText}>
                                        To update your payment method, go to the account settings and update your payment information. Make sure to save the changes.
                                    </Text>
                                </View>
                            )}
                            <List.Item
                                title="Why was my payment declined?"
                                onPress={() => {
                                    if (solutionItem === 'paymentDeclined') {
                                        setSolutionItem(null);
                                    }
                                    else {
                                        setSolutionItem('paymentDeclined');
                                    }
                                }}
                            />
                            {solutionItem === 'paymentDeclined' && (
                                <View style={styles.solutionContainer}>
                                    <Text style={styles.solutionText}>
                                        If your payment was declined, please check your payment information and ensure that you have sufficient funds. If the issue persists, contact your bank or payment provider for assistance.
                                    </Text>
                                </View>
                            )}
                            <List.Item
                                title="How to apply a discount code?"
                                onPress={() => {
                                    if (solutionItem === 'applyDiscount') {
                                        setSolutionItem(null);
                                    }
                                    else {
                                        setSolutionItem('applyDiscount');
                                    }
                                }}
                            />
                            {solutionItem === 'applyDiscount' && (
                                <View style={styles.solutionContainer}>
                                    <Text style={styles.solutionText}>
                                        To apply a discount code, go to the checkout page and enter the discount code in the designated field. Make sure to apply the code before completing the purchase.
                                    </Text>
                                </View>
                            )}
                        </List.Accordion>
                    </List.Section>
                </ScrollView>

                <View style={styles.footer}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.title}>Contact Us</Title>
                            <Paragraph style={styles.paragraph}>
                                If you need further assistance, please contact our support team.
                            </Paragraph>
                            <Button
                                mode="contained"
                                onPress={handleContactSupport}
                                style={styles.button}
                                labelStyle={styles.buttonLabel}
                            >
                                Contact Support
                            </Button>
                        </Card.Content>
                    </Card>
                </View>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Secondary,
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 100, // Add some padding to avoid overlap with the footer
    },
    card: {
        marginBottom: 16,
        backgroundColor: Colors.Secondary,
    },
    title: {
        fontSize: 20,
        color: Colors.Primary,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        color: Colors.DarkGray,
        marginBottom: 16,
    },
    accordion: {
        backgroundColor: Colors.Secondary,
    },
    button: {
        backgroundColor: Colors.Primary,
        width: '50%',
        alignSelf: 'center',
        marginTop: 10,
    },
    buttonLabel: {
        color: Colors.Secondary,
    },
    solutionContainer: {
        padding: 16,
        backgroundColor: Colors.lightGreen,
        borderRadius: 8,
        marginVertical: 8,
    },
    solutionText: {
        fontSize: 14,
        color: Colors.DarkGray,
    },
    footer: {
        backgroundColor: Colors.Secondary,
        padding: 16,
        paddingTop: 0,
    },
});