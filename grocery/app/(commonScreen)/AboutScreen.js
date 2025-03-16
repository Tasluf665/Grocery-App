import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Card, Title, Paragraph, Provider as PaperProvider, DefaultTheme, IconButton, Button } from 'react-native-paper';
import Colors from '../../constent/Colors';
import CustomFonts from '../../constent/customeFonts';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.Primary,
    },
};

export default function AboutScreen() {
    return (
        <PaperProvider theme={theme}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <Title style={styles.title}>About Us</Title>
                    </Card.Content>
                    <Card.Content>
                        <Paragraph style={styles.paragraph}>
                            <Text style={styles.highlight}>S</Text>ince 2013, our Grocery App has been dedicated to providing you with the best online grocery shopping experience. Our app offers a wide range of products, from fresh produce to household essentials, all at competitive prices.
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                            Our mission is to make grocery shopping convenient and hassle-free. With our user-friendly interface and fast delivery service, you can shop for your groceries from the comfort of your home and have them delivered to your doorstep in no time.
                        </Paragraph>
                        <View style={styles.highlightContainer}>
                            <Paragraph style={styles.highlightParagraph}>
                                Our app has an impressive rating of 4.9 from more than 2000 ratings.
                            </Paragraph>
                        </View>
                        <View style={styles.highlightContainer}>
                            <Paragraph style={styles.highlightParagraph}>
                                We offer a wide range of products, from fresh produce to household essentials, all at competitive prices.
                            </Paragraph>
                        </View>
                        <View style={styles.highlightContainer}>
                            <Paragraph style={styles.highlightParagraph}>
                                Our fast delivery service ensures that your groceries are delivered to your doorstep in no time.
                            </Paragraph>
                        </View>
                        <Paragraph style={styles.paragraph}>
                            Thank you for choosing our Grocery App. We are committed to serving you with the highest quality products and exceptional customer service.
                        </Paragraph>
                    </Card.Content>
                </View>
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
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: Colors.Primary,
        fontFamily: CustomFonts.Gilroy_ExtraBold,
        marginVertical: heightPercentageToDP(2),
    },
    paragraph: {
        fontSize: 16,
        color: Colors.DarkGray,
        marginBottom: 16,
        lineHeight: 24,
        fontFamily: CustomFonts.Lato_Regular,
    },
    highlight: {
        fontSize: 24,
        color: Colors.Primary,
        fontWeight: 'bold',
        fontFamily: CustomFonts.Gilroy_ExtraBold,
    },
    highlightContainer: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.Primary,
        paddingLeft: 8,
        marginVertical: 16,
    },
    highlightParagraph: {
        fontSize: 16,
        color: Colors.DarkGray,
        lineHeight: 24,
        fontFamily: CustomFonts.Lato_Bold,
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