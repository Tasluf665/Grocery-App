import React, { useEffect, useCallback, useState, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

import ProductCard from "../../component/ProductCard";
import { fetchProductsBySearch } from "../../utils/fetchProducts";
import { getSpecialSections } from "../../utils/specialSectionsSlice";
import { fetchBannerImages } from "../../utils/fetchBannerImages";

import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import SearchBar from "../../component/SearchBar";
import Colors from "../../constent/Colors";
import customeFonts from "../../constent/customeFonts";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function ShopScreen() {
    const dispatch = useDispatch();
    const router = useRouter();

    // 🔹 Get sections & loading state from Redux store
    const { sections, loading } = useSelector((state) => state.specialSections);

    // Search state
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Banner state
    const [bannerImages, setBannerImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    // Fetch special sections when component mounts
    useEffect(() => {
        dispatch(getSpecialSections());
    }, [dispatch]);

    // Fetch banner images from Firestore
    useEffect(() => {
        const loadBannerImages = async () => {
            const images = await fetchBannerImages();
            setBannerImages(images);
        };
        loadBannerImages();
    }, []);

    // Auto-scroll banner
    useEffect(() => {
        if (bannerImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
                );
                flatListRef.current?.scrollToIndex({
                    index: currentIndex,
                    animated: true,
                });
            }, 7000); // Change image every 7 seconds

            return () => clearInterval(interval);
        }
    }, [bannerImages.length, currentIndex]);

    // Debounced Search Function (Only API Call)
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.length > 0) {
                const results = await fetchProductsBySearch(query);
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        }, 500),
        []
    );

    // Handle Search Input (Instant UI Update)
    const handleSearchInput = (query) => {
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Handle "See All" Click
    const handleSeeAllClick = (section) => {
        router.push(`/ProductCategoryScreen?id=${section.id}&type=special_section&title=${section.name}`);
    };

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    // Render a single banner image
    const renderBannerItem = ({ item }) => (
        <Image source={{ uri: item.image }} style={styles.bannerImage} />
    );

    // Render a single section
    const renderSection = ({ item: section }) => (
        <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.name}</Text>
                <TouchableOpacity onPress={() => handleSeeAllClick(section)}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={section.products.slice(0, 6)}
                renderItem={({ item }) => <ProductCard product={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );

    // Main list data
    const listData = [
        { type: "logo" },
        { type: "searchBar" },
        ...(searchResults.length === 0 ? [{ type: "banner", data: bannerImages }] : []), // Conditionally include banner
        ...(searchResults.length > 0
            ? [{ type: "searchResults", data: searchResults }]
            : sections.map((section) => ({ type: "section", data: section })))
    ];

    // Render the main list
    const renderItem = ({ item }) => {
        switch (item.type) {
            case "logo":
                return (
                    <Image
                        source={require("../../assets/StartupImages/logo-green.png")}
                        style={styles.logo}
                    />
                );
            case "searchBar":
                return (
                    <SearchBar
                        placeholder="Search Store"
                        value={searchQuery}
                        onChangeText={handleSearchInput}
                    />
                );
            case "banner":
                return (
                    <FlatList
                        ref={flatListRef}
                        data={item.data}
                        renderItem={renderBannerItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScrollToIndexFailed={() => { }}
                        style={styles.bannerContainer}
                    />
                );
            case "section":
                return renderSection({ item: item.data });
            case "searchResults":
                return (
                    <FlatList
                        data={item.data}
                        renderItem={({ item }) => <ProductCard product={item} />}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={listData}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.type}-${index}`}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Secondary,
        padding: 20,
        paddingTop: 0,
    },
    logo: {
        width: wp(35),
        height: hp(5),
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 15,
        marginTop: 15,
    },
    bannerContainer: {
        marginBottom: 20,
    },
    bannerImage: {
        width: wp(88),
        height: hp(15),
        borderRadius: 15,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.BorderGray,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: customeFonts.Lato_Bold,
    },
    seeAllText: {
        fontSize: 14,
        color: Colors.Primary,
        fontFamily: customeFonts.Lato_Bold,
    },
    row: {
        justifyContent: "space-between",
    },
});