import { useEffect, useState } from "react";
import { Document, Page, Text, View, Image, StyleSheet, } from "@react-pdf/renderer";
import { useContext } from "react";
import { reportGenerationContext } from "./Context";

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    section: {
        marginLeft: "48px",
        marginRight: "48px",
        padding: 10,
        flexGrow: 1,
    },
    company: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
        marginTop: "24px",
        marginBottom: "24px",
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
        marginTop: 15,
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
    image: {
        width: "100px",
        height: "50px",
        marginTop: "20px",
        position: "absolute",
        top: "632px",
        right: "0",
    }
});



// const data = {
//     companyName: "Bit Busters",
//     clientName: "John Doe",
//     clientPhone: "(555) 555-5555",
//     clientEmail: "ejemplo@upr.edu",
//     address1: "123 Main St, Anytown, CA 12345",
//     address2: "apt 214 building 8",
//     address3: "Los Angeles, California, United States, 90028",
//     inspectorName: "Juan del Campo",
//     inspectorPhone: "7871234567",
//     inspectorEmail: "juandelpueblo@upr.edu",
//     comments: "Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes.",
//     images: [
//         "https://example.com/image1.jpg",
//         "https://example.com/image2.jpg",
//     ],
//     date: new Date().toLocaleDateString(), // Get current date
//     pipe1: "broken",
//     pipe2: "not broken",
//     pipe3: "broken",
//     brokenPipes: 2,
//     price: 10,
//     get total() {
//         return this.price * this.brokenPipes;
//     }
// };



const PDFDocument = ({ signature }) => {

    const { data } = useContext(reportGenerationContext);

    // Check if data exists before deconstructing it

    console.log("context data1", data);


    return (
        <Document>
            <Page size={{ width: 612, height: 792 }} style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.company}>{data?.companyName}</Text>

                    <Text style={styles.title}>Report of Broken Pipes</Text>
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
                        <Text style={styles.clientInfoType}>Apartment, Suite, Unit, Building, Floor: </Text>
                        <Text style={styles.clientInfo}>{data?.address2}</Text>

                    </View>

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

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.clientInfoType}>Date Visited: </Text>
                        <Text style={styles.clientInfo}>{data?.dateVisited}</Text>
                    </View>


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


                    <Text style={styles.subtitle}>Results:</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.clientInfoType}>Pipe #1: </Text>
                        <Text style={styles.clientInfo}>{data?.pipe1} </Text>

                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.clientInfoType}>Pipe #2: </Text>
                        <Text style={styles.clientInfo}>{data?.pipe2} </Text>

                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.clientInfoType}>Pipe #3: </Text>
                        <Text style={styles.clientInfo}>{data?.pipe3} </Text>

                    </View>
                    <View>
                    <Text style={styles.subtitle}>Comments:</Text>
                    <Text style={styles.clientInfoType}>{data?.comments}</Text>
                    </View>

                    <Text style={styles.subtitle}>Price</Text>

                    <View style={{flexDirection: "row"}}>
                    <Text style={styles.clientInfoType}>Amount of Broken Pipes: </Text>
                    <Text style={styles.clientInfo}>{data?.brokenPipes}</Text>
                    </View>

                    <View style={{flexDirection: "row"}}>
                    <Text style={styles.clientInfoType}>Price: $</Text>
                    <Text style={styles.clientInfo}>{data?.price}</Text>
                    </View>

                    <View style={{flexDirection: "row"}}>
                    <Text style={styles.clientInfoType}>total: $</Text>
                    <Text style={styles.clientInfo}>{data?.total}</Text>
                    </View>
                    {/* <View>
                    <Text style={styles.clientInfo}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                        Sapiente earum, explicabo architecto accusamus itaque quaerat? 
                        Perspiciatis nobis, excepturi alias nisi odit sapiente provident 
                        aut error consequuntur veniam, dolores quo? Et.
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                        Sapiente earum, explicabo architecto accusamus itaque quaerat? 
                        Perspiciatis nobis, excepturi alias nisi odit sapiente provident 
                        aut error consequuntur veniam, dolores quo? Et.
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                        Sapiente earum, explicabo architecto accusamus itaque quaerat? 
                        Perspiciatis nobis, excepturi alias nisi odit sapiente provident 
                        aut error consequuntur veniam, dolores quo? Et.
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                        Sapiente earum, explicabo architecto accusamus itaque quaerat? 
                        Perspiciatis nobis, excepturi alias nisi odit sapiente provident 
                        aut error consequuntur veniam, dolores quo? Et.
                    </Text>
                    </View> */}
                    

                    {signature && <Image src={signature} style={styles.image} />}
                    <Text style={styles.signature}>Signature</Text>

                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} fixed />

                </View>
            </Page>
        </Document>
    );
}


export default PDFDocument