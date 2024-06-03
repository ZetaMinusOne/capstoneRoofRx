import { Document, Page, Text, View, Image, StyleSheet, } from "@react-pdf/renderer";
import { useContext, useState, useEffect } from "react";
import { reportGenerationContext } from "./Context";
import { downloadData, } from 'aws-amplify/storage';
import AWS from 'aws-sdk'


const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: "48px",
        backgroundColor: '#FFFFFF',
    },
    section: {
        // marginLeft: "48px",
        // marginRight: "48px",
        padding: 10,
        flexGrow: 1,
    },
    company: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
        // marginTop: "24px",
        // marginBottom: "24px",
    },
    title: {
        fontSize: 18,
        fontWeight: '',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '',
        marginBottom: 10,
        // marginTop: 15,
    },
    date: {
        fontSize: 12,
        fontWeight: '',
        textAlign: "right"
    },
    clientInfoType: {
        fontSize: 12,
        marginBottom: "5",
    },
    clientInfo: {
        fontSize: 12,
        textDecoration: "underline",
    },
    comments: {
        fontSize: 16,
    },
    signature: {
        width: "100px",
        fontSize: "12",
        borderTop: "1px",
        position: "absolute",
        top: "702px",
        right: "0",
    },
    pageNumber: {
        textAlign: "center",
        fontSize: 12,
        position: "absolute",
        top: "722px",
        right: "250px"

    },
    signatureImage: {
        width: "100px",
        height: "50px",
        marginTop: "20px",
        position: "absolute",
        top: "632px",
        right: "0",
    },
    image: {
        width: "225px",
        height: "225px",
        marginBottom: "5px",
        marginRight: "10px",
    },
    message: {
        marginBottom: "10px",
        fontSize: "12",
    }

});

const PDFDocument = ({ signature, isSigned }) => {

    const { data, setValues } = useContext(reportGenerationContext);

    console.log("IMAGES PDFDOCUMENT VIEW", data.images);

    const [blob, setBlob] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imagePaths, setImagePaths] = useState({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentPipe, setCurrentPipe] = useState(0);

    useEffect(() => {
        console.log("THIS IS THE IMAGE PATHS VARIABLE", imagePaths);
    }, [imagePaths]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await saveUrlsFromS3();
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error accordingly
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // const saveUrlsFromS3 = async () => {
    //     const allUsableUrls = {};
    //     Object.entries(data.images).forEach(async ([pipeKey, pipeArray]) => {
    //         const usableUrls = pipeArray.map(async (pipe) => {
    //             const url = pipe.url;
    //             const parts = url.split('/');
    //             const bucket_name = parts[2].split('.')[0];
    //             const objectKey = parts.slice(4).join('/');
    //             const downloadResult = await downloadData({ key: objectKey }).result;
    //             const blobThing = await downloadResult.body.blob();
    //             return URL.createObjectURL(blobThing);
    //         });
    //         allUsableUrls[pipeKey] = await Promise.all(usableUrls);

    //         console.log("ALL USABLE URLS", allUsableUrls);
    //     });
    //     setImagePaths(allUsableUrls);
    // }

    // const saveUrlsFromS3AndCalculateBrokenPipes = async () => {
    //     const allUsableUrls = {};
    //     let brokenPipeCount = 0;

    //     // Use for...of for proper handling of async/await inside loops
    //     for (const [pipeKey, pipeArray] of Object.entries(data.images)) {
    //         const usableUrls = [];
    //         let pipeIsBroken = false;

    //         // Loop through each item in the pipeArray
    //         for (const pipe of pipeArray) {
    //             const url = pipe.url;
    //             const parts = url.split('/');
    //             const bucket_name = parts[2].split('.')[0];
    //             const objectKey = parts.slice(4).join('/');

    //             try {
    //                 const downloadResult = await downloadData({ key: objectKey }).result;
    //                 const blobThing = await downloadResult.body.blob();
    //                 const localUrl = URL.createObjectURL(blobThing);

    //                 // Assume predictions are also part of the `pipe` object
    //                 const predictions = pipe.predictions;
    //                 usableUrls.push({
    //                     predictions: predictions,
    //                     url: localUrl
    //                 });

    //                 // Update pipe broken status if not already broken
    //                 if (!pipeIsBroken && predictions[0] < predictions[1]) {
    //                     pipeIsBroken = true;
    //                 }
    //             } catch (error) {
    //                 console.error("Error downloading or converting file:", error);
    //                 continue;
    //             }
    //         }

    //         allUsableUrls[pipeKey] = usableUrls;

    //         // If the pipe is broken, increment the broken pipe count
    //         if (pipeIsBroken) {
    //             brokenPipeCount++;
    //         }
    //     }

    //     // Set the URLs and the number of broken pipes
    //     setImagePaths(allUsableUrls);
    //     setValues(prevData => ({ ...prevData, brokenPipeCount }));

    //     console.log("ALL USABLE URLS", allUsableUrls);
    //     console.log("Number of Broken Pipes:", brokenPipeCount);
    // }

    const convertUrlToDataUri = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
        });
    };

    const saveUrlsFromS3 = async () => {
        const allUsableUrls = {};

        if (typeof data.images.result === 'string') {
            // console.log(data.images.result)
            const prediction = data.images.result
            const usableUrls = []
            const s3 = new AWS.S3({
                accessKeyId: 'AKIAR7NCUGFH5QXSLHUT',//process.env.REACT_APP_ACCESS_KEY_ID,
                secretAccessKey: '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',//process.env.REACT_APP_SECRET_ACCESS_KEY,
            });
            const params = {
                Bucket: 'roofrx', Key:
                    data.images.classified_image_path
            };

            console.log("The params are", params);
            s3.getObject(params, async (err, data) => {
                if (err) console.log(err, err.stack); // an error occurred

                console.log("The download result is", data);
                let blob = new Blob([data.Body], { type: 'image/jpeg' });

                const url = URL.createObjectURL(blob);
                console.log("The URL is", url);
                usableUrls.push({
                    predictions: prediction,
                    url: await convertUrlToDataUri(url),
                });

                allUsableUrls[0] = usableUrls;

            });
            console.log(usableUrls)
            setImagePaths(allUsableUrls); // Assuming setImagePaths is your state setter

        } else {

            // Use for...of for proper handling of async/await inside loops
            for (const [pipeKey, pipeArray] of Object.entries(data.images)) {
                const usableUrls = [];

                // Loop through each item in the pipeArray
                for (const pipe of pipeArray) {
                    const url = pipe.url;
                    const parts = url.split('/');
                    // const bucket_name = parts[2].split('.')[0];
                    const objectKey = parts.slice(4).join('/');

                    try {
                        const downloadResult = await downloadData({ key: objectKey }).result;
                        const blobThing = await downloadResult.body.blob();
                        const localUrl = URL.createObjectURL(blobThing);

                        // Assume predictions are also part of the `pipe` object
                        // Structure each item as desired
                        usableUrls.push({
                            predictions: pipe.predictions,
                            url: await convertUrlToDataUri(localUrl),
                        });
                    } catch (error) {
                        console.error("Error downloading or converting file:", error);
                        continue;
                    }
                }

                allUsableUrls[pipeKey] = usableUrls;
            }

            console.log("ALL USABLE URLS", allUsableUrls);
            setImagePaths(allUsableUrls); // Assuming setImagePaths is your state setter
        }
    };




    function calculateBrokenPipes(data) {
        let brokenPipesCount = 0;

        // Loop through each pipe (pipe1 and pipe2)
        for (const pipe in data) {
            for (const item of data[pipe]) {
                const predictions = item.predictions;

                // Check if the first prediction is less than the second
                if (predictions[0] < predictions[1]) {
                    brokenPipesCount++;
                    break; // Only count one broken pipe per pipe
                }
            }
        }
        //setValues({...data, brokenPipes: brokenPipesCount})
        return brokenPipesCount;
    }


    function identifyBrokenPipes(data) {
        const pipeStatuses = [];
        if (typeof data.result === 'string') return data.result
        // Loop through each pipe (pipe1 and pipe2)
        for (const pipe in data) {
            const pipeName = `Pipe # ${pipe.slice(4)}`; // Extract pipe number
            let pipeStatus = "Not Broken";  // Default status

            for (const item of data[pipe]) {
                const predictions = item.predictions;

                // Check if the first prediction is less than the second
                if (predictions[0] < predictions[1]) {
                    pipeStatus = "Broken";
                    break; // Only identify one broken pipe per pipe
                }
            }

            pipeStatuses.push(`${pipeName}: ${pipeStatus}`); // Combine pipe name and status
        }

        return pipeStatuses.join("\n"); // Join list elements with newlines
    }


    // const pipes = [
    //     {
    //         pipeNumber: 2,
    //         images: [{ source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 4' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 5' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 6' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 7' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 8' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 9' }],
    //     },
    //     {
    //         pipeNumber: 1,
    //         images: [{ source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 1' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 2' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 3' }],
    //     },
    //     {
    //         pipeNumber: 3,
    //         images: [{ source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 10' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 11' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 12' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 13' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 14' },],
    //     },
    //     {
    //         pipeNumber: 4,
    //         images: [{ source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 10' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 11' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 12' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 13' },],
    //     },
    //     {
    //         pipeNumber: 5,
    //         images: [{ source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 10' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 11' },
    //         ],
    //     },
    //     {
    //         pipeNumber: 6,
    //         images: [{ source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 10' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 11' },
    //         ],
    //     },
    //     {
    //         pipeNumber: 7,
    //         images: [{ source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 10' },
    //         { source: '/images/TestImagesDisplayPDF/OIG4 (9).jpeg', message: 'Message for Image 11' },
    //         ],
    //     },

    // ]

    // Check if data exists before deconstructing it

    console.log("context data1", data);
    console.log("IMAGES BEFORE BUILDING PDF********************************************:", imagePaths);


    return (
        <Document>
            <Page size={{ width: 612, height: 792 }} style={styles.page} break>
                <View style={styles.section}>
                    <Text style={styles.company}>RoofRx</Text>

                    <Text style={styles.title}>Report of Inspection</Text>
                    <Text style={styles.date}>Date: {data?.date}</Text>


                    <Text style={styles.subtitle}>Client Information:</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.clientInfoType}>Full Name: </Text>
                        <Text style={styles.clientInfo}>{data?.firstName} {data?.lastName}</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.clientInfoType}>Street Address: </Text>
                        <Text style={styles.clientInfo}>{data?.address1}</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.clientInfoType}>Apt, Suite, Unit, Building, Floor: </Text>
                        <Text style={styles.clientInfo}>{data?.address2}</Text>

                    </View>


                    <View style={{ marginBottom: "15px" }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.clientInfoType}>State, City, Country, Zipcode: </Text>
                            <Text style={styles.clientInfo}>{data?.country} {data?.state} {data?.city} {data?.zipcode}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.clientInfoType}>Phone Number: </Text>
                            <Text style={styles.clientInfo}>{data?.phoneNumber}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.clientInfoType}>Email: </Text>
                            <Text style={styles.clientInfo}>{data?.email}</Text>
                        </View>

                        {/* <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.clientInfoType}>Date Visited: </Text>
                        <Text style={styles.clientInfo}>{data?.dateVisited}</Text>
                    </View> */}
                    </View>

                    <View style={{ marginBottom: "15px" }}>
                        <Text style={styles.subtitle}>Inspector Information:</Text>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.clientInfoType}>Full Name: </Text>
                            <Text style={styles.clientInfo}>{data?.inspectorFirstName} </Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.clientInfoType}>Phone Number: </Text>
                            <Text style={styles.clientInfo}>{data?.inspectorPhoneNumber}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.clientInfoType}>Email:</Text>
                            <Text style={styles.clientInfo}>{data?.inspectorEmail}</Text>

                        </View>
                    </View>

                    <View style={{ marginBottom: "15px" }}>
                        <Text style={styles.subtitle}>Results:</Text>

                        <View style={{ flexDirection: 'row' }}>
                            {/* <Text style={styles.clientInfoType}>Pipe #1: </Text> */}
                            <Text style={styles.clientInfoType}>{identifyBrokenPipes(data.images)} </Text>

                        </View>
                    </View>

                    <View style={{ marginBottom: "15px" }}>
                        <View>
                            <Text style={styles.subtitle}>Comments:</Text>
                            <Text style={styles.clientInfoType}>{data?.comments}</Text>
                        </View>
                    </View>
                    <View style={{ marginBottom: "15px" }}>
                        <Text style={styles.subtitle}>Price</Text>

                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.clientInfoType}>Results: </Text>
                            <Text style={styles.clientInfo}>{data.brokenPipes}</Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.clientInfoType}>Price per item: $</Text>
                            <Text style={styles.clientInfo}>{data?.price}</Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.clientInfoType}>Total: $</Text>
                            {typeof data.images.result === "string" ? <Text style={styles.message}>$100</Text>:
                            <Text style={styles.clientInfo}>{data.brokenPipes * data.price}</Text>}
                        </View>
                    </View>

                    {signature && isSigned && <Image src={signature} style={styles.signatureImage} />}
                    <Text style={styles.signature}>Signature</Text>

                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} fixed />

                </View>
            </Page>

            <Page size={{ width: 612, height: 792 }} style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Images:
                    </Text>
                    {/* Iterate over each pipe object */}
                    {Object.entries(imagePaths).map(([key, images]) => (

                        <View key={key}>
                            {console.log(images)}
                            <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "start", marginBottom: "5px" }}>
                                {images.map((item, index) => (
                                    <View key={index} style={{ marginRight: "10px", alignItems: 'center' }}>
                                        <Image src={item.url} alt={`From ${key} ${index + 1}`} style={styles.image} />
                                        {/* Determine and display the condition based on predictions */}
                                        {typeof data.images.result === "string" ? <Text style={styles.message}>{item.predictions}</Text>:
                                        <Text style={styles.message}> {item.predictions[0] > item.predictions[1] ? `${key}: Not Broken` : `${key}: Broken`}</Text>}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}


                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} fixed />
                </View>
            </Page>
        </Document>
    );
}


export default PDFDocument