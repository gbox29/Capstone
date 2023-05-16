import * as React from 'react';
import "../../css/admin/admin.css"
import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { VictoryPie, VictoryChart, VictoryAxis, VictoryBar, VictoryHistogram } from 'victory';
import { motion } from "framer-motion"






export default function AdminDashboard() {
    const [piedataAxios, setPieDataAxios] = useState([]);
    const [linedataAxios, setLineDataAxios] = useState([]);
    const [totalusersAxios, setTotalUsersAxios] = useState(0);
    const [totalusersregAxios, setTotalUsersRegAxios] = useState(0);
    const [totalenrolledusersAxios, setTotalEnrolledUsersAxios] = useState(0);
    const [usersavgrateAxios, setUsersAvgRateAxios] = useState(0);

    const getResult = () => {
        Axios.get("https://mathflix.herokuapp.com/api/admin/total_users_data").then((response) => {
            if (response) {
                setTotalUsersAxios(response.data.result);
            }
        });
        Axios.get("https://mathflix.herokuapp.com/api/admin/reg_users_data").then((response) => {
            if (response) {
                setTotalUsersRegAxios(response.data.result);
            }
        });
        Axios.get("https://mathflix.herokuapp.com/api/admin/enrolled_users_data").then((response) => {
            if (response) {
                setTotalEnrolledUsersAxios(response.data.result);
            }
        });
        Axios.get("https://mathflix.herokuapp.com/api/admin/users_rate_data").then((response) => {
            if (response) {
                setUsersAvgRateAxios(response.data.result);
            }
        });
        Axios.get("https://mathflix.herokuapp.com/api/admin/pie_data").then((response) => {
            if (response.data.message) {
                console.log(response.data.message);
            }else{
                setPieDataAxios(response.data.result);
            }
        });

        Axios.get("https://mathflix.herokuapp.com/api/admin/linegraph_data").then((response) => {
            if (response.data.message) {
                console.log(response.data.message);
            }else{
                setLineDataAxios(response.data.result);
            }
        });
    }

   
    useEffect(() => {
        getResult();
    }, []);


    const piedata = piedataAxios?.map((datum) => ({ x: datum.kindofuser, y: datum.student_count }));
    const linedata = linedataAxios?.map((datum) => ({ x: datum.month, y: datum.num_users }));

    const sampledata = [
        { month: "Jan", users: 100 },
        { month: "Feb", users: 150 },
        { month: "Mar", users: 200 },
        { month: "Apr", users: 250 },
        { month: "May", users: 300 },
        { month: "Jun", users: 350 },
        { month: "Jul", users: 400 },
        { month: "Aug", users: 450 },
        { month: "Sep", users: 500 },
        { month: "Oct", users: 550 },
        { month: "Nov", users: 600 },
        { month: "Dec", users: 650 }
    ];

    return (
        <div className="adminContent-container">
            <div className="attrib-container">
                {/** DASHBOARD SECTION **/}
                <div className='dashboard-container'>
                    <div className='title-dashboard'>
                        <h1>
                            Dashboard Section
                        </h1>
                    </div>

                    <div className='dashboard-attrib'>
                        {/** DASHBOARD HERE **/}
                        {/* <div class="grid-container">
                            <div class="box1">Box 1</div>
                            <div class="box2">Box 2</div>
                            <div class="box3">Box 3</div>
                            <div class="box4">Box 4</div>
                            <div class="box5">Box 5</div>
                        </div> */}
                        <div className='dashboard-text-container'>
                            <motion.div
                                    className="textbox1"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 1.0,
                                        duration: 0.3,
                                        ease: [0, 0.71, 0.2, 1.01],
                                        scale: {
                                            type: "spring",
                                            damping: 5,
                                            stiffness: 100,
                                            restDelta: 0.001
                                        }
                                    }}
                                >
                                <Typography variant="h5" color="initial">Total Number of Users</Typography>
                                <div>
                                    <Typography variant="h2" color="initial">{totalusersAxios}</Typography>
                                </div>
                            </motion.div>
                            <motion.div
                                    className="textbox2"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 1.2,
                                        duration: 0.3,
                                        ease: [0, 0.71, 0.2, 1.01],
                                        scale: {
                                            type: "spring",
                                            damping: 5,
                                            stiffness: 100,
                                            restDelta: 0.001
                                        }
                                    }}
                                >
                                <Typography variant="h5" color="initial">Total Students Registered</Typography>
                                <div>
                                    <Typography variant="h2" color="initial">{totalusersregAxios}</Typography>
                                </div>
                            </motion.div>
                            <motion.div
                                    className="textbox3"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 1.3,
                                        duration: 0.3,
                                        ease: [0, 0.71, 0.2, 1.01],
                                        scale: {
                                            type: "spring",
                                            damping: 5,
                                            stiffness: 100,
                                            restDelta: 0.001
                                        }
                                    }}
                                >
                                <Typography variant="h5" color="initial">Total Students Enrolled</Typography>
                                <div>
                                    <Typography variant="h2" color="initial">{totalenrolledusersAxios}</Typography>
                                </div>
                            </motion.div>
                            <motion.div
                                    className="textbox1"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 1.4,
                                        duration: 0.3,
                                        ease: [0, 0.71, 0.2, 1.01],
                                        scale: {
                                            type: "spring",
                                            damping: 5,
                                            stiffness: 100,
                                            restDelta: 0.001
                                        }
                                    }}
                                >
                                <Typography variant="h5" color="initial">Average Rate of Courses</Typography>
                                <div>
                                    <Typography variant="h2" color="initial">{usersavgrateAxios}</Typography>
                                </div>
                            </motion.div>

                        </div>
                        <div className='dashboard-chart-container'>
                            <div>
                                <motion.div
                                    className="dashboard-charts"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 1.8,
                                        duration: 0.3,
                                        ease: [0, 0.71, 0.2, 1.01],
                                        scale: {
                                            type: "spring",
                                            damping: 5,
                                            stiffness: 100,
                                            restDelta: 0.001
                                        }
                                    }}
                                >
                                    <div className='chart-title'>
                                        <h3>User Overall</h3>
                                    </div>
                                    <div>
                                        <VictoryPie
                                            style={{
                                                data: {
                                                    fillOpacity: 0.9, stroke: "black", strokeWidth: 1
                                                },
                                                labels: {
                                                    fontSize: 15, fill: "black"
                                                }
                                            }}
                                            colorScale={["tomato", "orange"]}
                                            data={piedata}
                                            labels={({ datum }) => `${datum.x}: ${(datum.y / piedata.reduce((sum, d) => sum + d.y, 0) * 100).toFixed(0)}%`}
                                            labelRadius={({ innerRadius }) => innerRadius + 40}

                                        />
                                    </div>
                                </motion.div>
                            </div>
                            <div>
                                <motion.div
                                    className="dashboard-charts"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 1.9,
                                        duration: 0.3,
                                        ease: [0, 0.71, 0.2, 1.01],
                                        scale: {
                                            type: "spring",
                                            damping: 5,
                                            stiffness: 100,
                                            restDelta: 0.001
                                        }
                                    }}
                                >
                                    <div className='chart-title'>
                                        <h3>Users Registered</h3>
                                    </div>
                                    <div>
                                        <VictoryChart

                                            domainPadding={{ x: 100 }}
                                        >
                                            <VictoryBar
                                                barRatio={1.0}
                                                style={{
                                                    data: { fill: "#c43a31" }
                                                }}
                                                data={linedata}
                                                x="x"
                                                y="y"
                                            />
                                        </VictoryChart>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}