
import Grid from "@mui/material/Grid";
import AdminPannel from "../../Styles/AdminPannelWrapper";
import Achivement from "../Tables/Achivement";
import MonthlyOverview from "../Tables/MonthlyOverView";
import WeeklyOverview from "../Tables/WeeklyOverview";
import TotalEarning from "../Tables/TotalEarning";
import CardStatsVertical from "../../Styles/CardStatsVertical";
import CustomersTable from "../Tables/CustomersTable";
import {ThemeProvider, createTheme} from "@mui/material";
import {customTheme, darkTheme} from "../Theme/CustomTheme";
import "./Dashboard.css";
import RecentlyAddedLaptops from "../Tables/RecentlyAddedLaptops";
import SalesOverTime from "../Tables/SalesOverTime";
import RecentOrders from "../Tables/RecentOrders";
import {BriefcaseVariantOutline, CurrencyUsd, HelpCircleOutline, Poll} from "mdi-material-ui";
import {useSelector} from "react-redux";

});

const Dashboard = () => {
    const {auth} = useSelector(store => store);
    const navigate = useNavigate()

    useEffect(()=>{
        const getData = async ()=>{
            const res = await api.get(`/api/dashboard/yearly-revenue`)
            const res2 = await api.get(`/api/dashboard/product-revenue-percentages`)

        }
        getData()
    },[])

    return (
        <div className="adminContainer ">
            <ThemeProvider theme={customTheme}>
                <AdminPannel>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={7}>
                            <Achivement/>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <PieChart/>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <WeeklyOverview/>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <YearOverview/>
                        </Grid>
                    </Grid>
                </AdminPannel>
            </ThemeProvider>
        </div>
    );
};

export default Dashboard;

