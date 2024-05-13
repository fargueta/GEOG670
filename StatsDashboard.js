import {
    Box,
    Text,
    Card,
    Select,
    Heading,
    Flex,
    HStack,
    SimpleGrid,
    CardBody,
    ChakraProvider,
    Center,
    useColorModeValue,
} from '@chakra-ui/react';

import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { database } from "./utils/config.js";
import { getDatabase, ref, onValue } from "firebase/database";
import ReactApexChart from 'react-apexcharts';
import Papa from 'papaparse';
import adm0_codes from './data/statsOptions/adm0_codes.csv'
import { tr } from '@faker-js/faker';

export default function StatsDashboardApex() {
    const [chartData, setChartData] = useState([]);
    const [biomeData, setBiomeData] = useState([]);
    const [ecoData, setEcoData] = useState([]);
    const [landcoverData, setLandCoverData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('Australia');
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('01');
    const [monthTitle, setMonthTitle] = useState('Jan');


    useEffect(() => {
        changeHandler();
    }, []); // Empty dependency array to run only once when the component mounts


    const changeHandler = async () => {
        try {
            const response = await fetch(adm0_codes);
            const csvData = await response.text();

            const results = Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
            });

            const countries = results.data.map((row) => row["ADM0_NAME"]);
            const filteredCountries = countries.filter((country) => country);
            const options = filteredCountries.map((country) => ({
                value: country,
                label: country,
            }));
            setCountryOptions(options);
        } catch (error) {
            console.error('Error fetching or parsing CSV:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dbRef = getDatabase();
                const dataRef = ref(dbRef, '/'); // Adjust the path as needed
                onValue(dataRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        // Filter data for Czech Republic, April 2022, and ecoregions
                        const filteredData = data[selectedCountry]?.['2022-'+selectedMonth]?.['biome'];
                        // Filter data for Czech Republic, April 2022, and ecoregions
                        const filteredEcoData = data[selectedCountry]?.['2022-'+selectedMonth]?.['ecoregion'];
                        // Filter data for Czech Republic, April 2022, and biomes
                        const filteredBiomeData = data[selectedCountry]?.['2022-'+selectedMonth]?.['biome'];
                        // Filter data for Czech Republic, April 2022, and landcover
                        const filteredLandCoverData = data[selectedCountry]?.['2022-'+selectedMonth]?.['landcover'];

                        if (filteredData) {
                            const dataArray = Object.values(filteredData);
                            // Convert object to array of objects
                            setChartData(dataArray);
                        }
                        if (filteredEcoData) {
                            // Convert object to array of objects
                            const dataArray = Object.values(filteredEcoData);
                            setEcoData(dataArray);
                        }
                        if (filteredBiomeData) {
                            // Convert object to array of objects
                            const dataArray = Object.values(filteredBiomeData);
                            setBiomeData(dataArray);
                        }
                        if (filteredLandCoverData) {
                            // Convert object to array of objects
                            const dataArray = Object.values(filteredLandCoverData);
                            setLandCoverData(dataArray);
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [selectedCountry, selectedMonth]);




    return (
        <ChakraProvider>
            <>
                <Card borderRadius={0} colorScheme='Blue'>
                    <CardBody p={1}>
                        <SimpleGrid
                            columns={{ base: 1, md: 3 }}
                            spacing={{ base: 2, md: 6 }}
                            p={1}
                            px={6}
                        >
                            <Flex alignItems="center">
                                <Text fontSize="sm" pr={1}>
                                    Month:
                                </Text>
                                <Select size="sm" onChange={(e) => {setSelectedMonth(e.target.value.slice(-2)); setMonthTitle(e.target.value.slice(0, 3)); }}>
                                    <option>Dec - 12</option>
                                    <option>Nov - 11</option>
                                    <option>Oct - 10</option>
                                    <option>Sept - 09</option>
                                    <option>Aug - 08</option>
                                    <option>Jul - 07</option>
                                    <option>Jun - 06</option>
                                    <option>May - 05</option>
                                    <option>Apr - 04</option>
                                    <option>Mar - 03</option>
                                    <option>Feb - 02</option>
                                    <option selected>Jan - 01</option>
                                </Select>
                            </Flex>
                            <Flex alignItems="center">
                                <Text fontSize="sm" pr={1}>
                                    Year:
                                </Text>
                                <Select size="sm">
                                    <option>2022</option>
                                </Select>
                            </Flex>
                            <Flex alignItems="center">
                                <Text fontSize="sm" pr={1}>
                                    Country:
                                </Text>
                                <Select placeholder="Select a country" onChange={(e) => setSelectedCountry(e.target.value)}>
                                    {countryOptions.map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>

                            </Flex>
                        </SimpleGrid>
                    </CardBody>
                </Card>
                <SimpleGrid
                    columns={{ sm: 1, md: 2, lg: 2, xl: 2 }}
                    spacing={6}
                >
                    <Center py={6} px="50px">
                        <Box
                            width={{ base: 'full', md: 'auto' }}
                            height={'450px'}
                            maxW={'600px'}
                            minW={'550px'}
                            bg={useColorModeValue('gray.200', 'gray.900')}
                            // boxShadow={'2xl'}
                            rounded={'lg'}
                            p={6}
                            textAlign={'center'}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                            <ReactApexChart
                                    options={{
                                        chart: {
                                            toolbar: {
                                              show: true,
                                              offsetX: 0,
                                              offsetY: 0,
                                              tools: {
                                                download: true,
                                                selection: true,
                                                zoom: true,
                                                zoomin: true,
                                                zoomout: true,
                                                pan: true,
                                              },
                                              export: {
                                                csv: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022_Eco',
                                                  columnDelimiter: ',',
                                                  headerCategory: 'eco_name',
                                                  headerValue: 'eco_burnedarea'
                                                },
                                                svg: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022',
                                                },
                                                png: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022',
                                                }
                                              },
                                              autoSelected: 'zoom' 
                                            },
                                        },
                                        plotOptions: {
                                            bar: {
                                                barHeight: '100%',
                                                distributed: false,
                                                horizontal: true,
                                                dataLabels: {
                                                    position: 'bottom',
                                                },
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            textAnchor: 'start',
                                            style: {
                                                colors: ['#000']
                                            },
                                            formatter: function (val, opt) {
                                                const ecoName = ecoData[opt.dataPointIndex].eco_name;
                                                const formattedValue = parseFloat(val).toFixed(0);
                                                // return biomeName + ":  " + formattedValue;
                                                return ecoName
                                            },
                                            offsetX: 0,
                                            dropShadow: {
                                                enabled: true
                                            },
                                        },
                                        stroke: {
                                            width: 1,
                                            colors: ['#fff']
                                        },
                                        xaxis: {
                                            categories: ecoData.map(item => item.eco_name),
                                            title: {
                                                text: 'Burned Area (ha)',
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Arial, sans-serif',
                                                    color: '#333'
                                                }
                                            }
                                            
                        
                                        },
                                        yaxis: {
                                            labels: {
                                                show: false
                                            },
                                            title: {
                                                text: 'RESOLVE Ecoregion Name',
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Arial, sans-serif',
                                                    color: '#333'
                                                }
                                            }
                                        },
                                        title: {
                                            text: selectedCountry+' '+monthTitle+'. 2022 Burn Area Estimates by Ecoregion',
                                            align: 'center',
                                            floating: true,
                                        },
                                        // subtitle: {
                                        //     text: 'Category Names as DataLabels inside bars',
                                        //     align: 'center',
                                        // },
                                        tooltip: {
                                            theme: 'dark',
                                            x: {
                                                show: false
                                            },
                                            y: {
                                                title: {
                                                    formatter: function () {
                                                        return ''
                                                    }
                                                }
                                            }
                                        },
                                        legend: {
                                            show: false // Setting legend option to false to remove the legend
                                        },
                                        colors: ['#805939']

                                        
                                    }}
                                    series={[{
                                        data: ecoData.map(item => parseFloat(item.eco_burnedarea).toFixed(0)),
                                    }]}
                                    type="bar"
                                    height={480}
                                />
                            </ResponsiveContainer>
                        </Box>
                    </Center>
                    <Center py={6} px="50px">
                        <Box
                            width={{ base: 'full', md: 'auto' }}
                            height={'450px'}
                            maxW={'600px'}
                            minW={'550px'}
                            bg={useColorModeValue('gray.200', 'gray.900')}
                            // boxShadow={'2xl'}
                            rounded={'lg'}
                            p={6}
                            textAlign={'center'}
                        >
                            
                            <ResponsiveContainer width="100%" height="100%">
                            <ReactApexChart
                                    options={{
                                        chart: {
                                            toolbar: {
                                              show: true,
                                              offsetX: 0,
                                              offsetY: 0,
                                              tools: {
                                                download: true,
                                                selection: true,
                                                zoom: true,
                                                zoomin: true,
                                                zoomout: true,
                                                pan: true,
                                              },
                                              export: {
                                                csv: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022_biome',
                                                  columnDelimiter: ',',
                                                  headerCategory: 'biome_name',
                                                  headerValue: 'biome_burnedarea'
                                                },
                                                svg: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022',
                                                },
                                                png: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022',
                                                }
                                              },
                                              autoSelected: 'zoom' 
                                            },
                                        },
                                        plotOptions: {
                                            bar: {
                                                barHeight: '100%',
                                                distributed: false,
                                                horizontal: true,
                                                dataLabels: {
                                                    position: 'bottom',
                                                },
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            textAnchor: 'start',
                                            style: {
                                                colors: ['#000']
                                            },
                                            formatter: function (val, opt) {
                                                const biomeName = biomeData[opt.dataPointIndex].biome_name;
                                                const formattedValue = parseFloat(val).toFixed(0);
                                                // return biomeName + ":  " + formattedValue;
                                                return biomeName
                                            },
                                            offsetX: 0,
                                            dropShadow: {
                                                enabled: true
                                            },
                                        },
                                        stroke: {
                                            width: 1,
                                            colors: ['#fff']
                                        },
                                        xaxis: {
                                            categories: biomeData.map(item => item.biome_name),
                                            title: {
                                                text: 'Burned Area (ha)',
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Arial, sans-serif',
                                                    color: '#333'
                                                }
                                            }
                                            
                        
                                        },
                                        yaxis: {
                                            labels: {
                                                show: false
                                            },
                                            title: {
                                                text: 'RESOLVE Biome Name',
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Arial, sans-serif',
                                                    color: '#333'
                                                }
                                            }
                                        },
                                        title: {
                                            text: selectedCountry+' '+monthTitle+'. 2022 Burn Area Estimates by Biome',
                                            align: 'center',
                                            floating: true,
                                        },
                                        // subtitle: {
                                        //     text: 'Category Names as DataLabels inside bars',
                                        //     align: 'center',
                                        // },
                                        tooltip: {
                                            theme: 'dark',
                                            x: {
                                                show: false
                                            },
                                            y: {
                                                title: {
                                                    formatter: function () {
                                                        return ''
                                                    }
                                                }
                                            }
                                        },
                                        legend: {
                                            show: false // Setting legend option to false to remove the legend
                                        }
                                        
                                    }}
                                    series={[{
                                        data: biomeData.map(item => parseFloat(item.biome_burnedarea).toFixed(0)),
                                    }]}
                                    type="bar"
                                    height={380}
                                />
                            </ResponsiveContainer>
                        </Box>
                    </Center>
                    <Center py={6} px="50px">
                        <Box
                            width={{ base: 'full', md: 'auto' }}
                            height={'450px'}
                            maxW={'600px'}
                            minW={'550px'}
                            bg={useColorModeValue('gray.200', 'gray.900')}
                            // boxShadow={'2xl'}
                            rounded={'lg'}
                            p={6}
                            textAlign={'center'}
                        >
                            
                            <ResponsiveContainer width="100%" height="100%">
                            <ReactApexChart
                                    options={{
                                        chart: {
                                            toolbar: {
                                              show: true,
                                              offsetX: 0,
                                              offsetY: 0,
                                              tools: {
                                                download: true,
                                                selection: true,
                                                zoom: true,
                                                zoomin: true,
                                                zoomout: true,
                                                pan: true,
                                              },
                                              export: {
                                                csv: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022_landcover',
                                                  columnDelimiter: ',',
                                                  headerCategory: 'igbp_name',
                                                  headerValue: 'landcover_burnedarea'
                                                },
                                                svg: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022',
                                                },
                                                png: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022',
                                                }
                                              },
                                              autoSelected: 'zoom' 
                                            },
                                        },
                                        plotOptions: {
                                            bar: {
                                                barHeight: '100%',
                                                distributed: false,
                                                horizontal: true,
                                                dataLabels: {
                                                    position: 'bottom',
                                                },
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            textAnchor: 'start',
                                            style: {
                                                colors: ['#000']
                                            },
                                            formatter: function (val, opt) {
                                                const lcName = landcoverData[opt.dataPointIndex].igbp_nam;
                                                const formattedValue = parseFloat(val).toFixed(0);
                                                // return biomeName + ":  " + formattedValue;
                                                return lcName
                                            },
                                            offsetX: 0,
                                            dropShadow: {
                                                enabled: true
                                            },
                                        },
                                        stroke: {
                                            width: 1,
                                            colors: ['#fff']
                                        },
                                        xaxis: {
                                            categories: landcoverData.map(item => item.igbp_nam),
                                            title: {
                                                text: 'Burned Area (ha)',
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Arial, sans-serif',
                                                    color: '#333'
                                                }
                                            }
                                            
                        
                                        },
                                        yaxis: {
                                            labels: {
                                                show: false
                                            },
                                            title: {
                                                text: 'IGBP Land Cover Class',
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Arial, sans-serif',
                                                    color: '#333'
                                                }
                                            }
                                        },
                                        title: {
                                            text: selectedCountry+' '+monthTitle+'. 2022 Burn Area Estimates by Land Cover',
                                            align: 'center',
                                            floating: true,
                                        },
                                        // subtitle: {
                                        //     text: 'Category Names as DataLabels inside bars',
                                        //     align: 'center',
                                        // },
                                        tooltip: {
                                            theme: 'dark',
                                            x: {
                                                show: false
                                            },
                                            y: {
                                                title: {
                                                    formatter: function () {
                                                        return ''
                                                    }
                                                }
                                            }
                                        },
                                        legend: {
                                            show: false // Setting legend option to false to remove the legend
                                        },
                                        colors: ['#ed8936']
                                        
                                    }}
                                    series={[{
                                        data: landcoverData.map(item => parseFloat(item.landcover_burnedarea).toFixed(0)),
                                    }]}
                                    type="bar"
                                    height={380}
                                />
                            </ResponsiveContainer>
                        </Box>
                    </Center>
                    {/* <Center py={6} px="50px">
                        <Box
                            width={{ base: 'full', md: 'auto' }}
                            height={'450px'}
                            maxW={'600px'}
                            minW={'550px'}
                            bg={useColorModeValue('gray.200', 'gray.900')}
                            // boxShadow={'2xl'}
                            rounded={'lg'}
                            p={6}
                            textAlign={'center'}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <ReactApexChart
                                    options={{
                                        chart: {
                                            toolbar: {
                                              show: true,
                                              offsetX: 0,
                                              offsetY: 0,
                                              tools: {
                                                download: true,
                                                selection: true,
                                                zoom: true,
                                                zoomin: true,
                                                zoomout: true,
                                                pan: true,
                                              },
                                              export: {
                                                csv: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022',
                                                  columnDelimiter: ',',
                                                  headerCategory: 'biome_name',
                                                  headerValue: 'biome_burnedarea'
                                                },
                                                svg: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022',
                                                },
                                                png: {
                                                  filename: selectedCountry+'_'+monthTitle+'_2022',
                                                }
                                              },
                                              autoSelected: 'zoom' 
                                            },
                                        },
                                        plotOptions: {
                                            bar: {
                                                barHeight: '100%',
                                                distributed: false,
                                                horizontal: true,
                                                dataLabels: {
                                                    position: 'bottom',
                                                },
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            textAnchor: 'start',
                                            style: {
                                                colors: ['#000']
                                            },
                                            formatter: function (val, opt) {
                                                const biomeName = chartData[opt.dataPointIndex].biome_name;
                                                const formattedValue = parseFloat(val).toFixed(0);
                                                // return biomeName + ":  " + formattedValue;
                                                return biomeName
                                            },
                                            offsetX: 0,
                                            dropShadow: {
                                                enabled: true
                                            },
                                        },
                                        stroke: {
                                            width: 1,
                                            colors: ['#fff']
                                        },
                                        xaxis: {
                                            categories: chartData.map(item => item.biome_name),
                                            title: {
                                                text: 'Burned Area (ha)',
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Arial, sans-serif',
                                                    color: '#333'
                                                }
                                            }
                                            
                        
                                        },
                                        yaxis: {
                                            labels: {
                                                show: false
                                            },
                                            title: {
                                                text: 'RESOLVE Biome Name',
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Arial, sans-serif',
                                                    color: '#333'
                                                }
                                            }
                                        },
                                        title: {
                                            text: selectedCountry+' '+monthTitle+'. 2022 Burn Area Estimates by Biome',
                                            align: 'center',
                                            floating: true,
                                        },
                                        // subtitle: {
                                        //     text: 'Category Names as DataLabels inside bars',
                                        //     align: 'center',
                                        // },
                                        tooltip: {
                                            theme: 'dark',
                                            x: {
                                                show: false
                                            },
                                            y: {
                                                title: {
                                                    formatter: function () {
                                                        return ''
                                                    }
                                                }
                                            }
                                        },
                                        legend: {
                                            show: false // Setting legend option to false to remove the legend
                                        },
                                        colors: ['#33b2df']
                                        
                                    }}
                                    series={[{
                                        data: chartData.map(item => parseFloat(item.biome_burnedarea).toFixed(0)),
                                    }]}
                                    type="bar"
                                    height={380}
                                />
                            </ResponsiveContainer>
                        </Box>
                    </Center> */}
                </SimpleGrid>

            </>
        </ChakraProvider>
    );
}