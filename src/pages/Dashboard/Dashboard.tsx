import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GlobalStyle } from "../../../globalStyle";
import { BarChart } from "react-native-chart-kit";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PieChart from "react-native-pie-chart";
import { setLoading } from "../../redux/action/Ui/Uislice";
import Icon from "react-native-vector-icons/FontAwesome";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [pieChart, setPieChart] = useState<any>([
    {
      name: "Pending",
      population: 0,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Delivered",
      population: 0,
      color: "green",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ]);
  const sliceColor = ["rgba(131, 167, 234, 1)", "green"];
  const [pieData, setPieData] = useState<any>([1, 0]);
  const [barChart, setBarChart] = useState<any>({
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  });
  const { designsMaster } = useSelector(
    (state: RootState) => state.designMaster
  );
  const { deliveredDesigns } = useSelector(
    (state: RootState) => state.deliveredDesigns
  );
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 20;
  //   {
  //     date: "25/06/2024",
  //     partyName: "Ramu inter",
  //     designNo: "1",
  //     availableStocks: 135,
  //     sampleImg: [
  //       "https://thumbs.dreamstime.com/b/close-up-indian-saree-design-banarasi-indain-wedding-party-traditional-red-silk-sari-yellow-gold-border-great-130471986.jpg?w=768",
  //     ],
  //     stoneDeails: [],
  //     designDetails: [],
  //     jobWorkDetails: [],
  //     total: 1300,
  //   },
  //   {
  //     date: "15/01/2024",
  //     partyName: "Sharda inter",
  //     designNo: "2",
  //     availableStocks: 100,
  //     sampleImg: [
  //       "https://thumbs.dreamstime.com/b/indian-traditional-silk-saree-beautiful-latest-design-130345708.jpg?w=768",
  //     ],
  //     stoneDeails: [],
  //     designDetails: [],
  //     jobWorkDetails: [],
  //     total: 700,
  //   },
  //   {
  //     date: "06/02/2024",
  //     partyName: "Sharda inter",
  //     designNo: "3",
  //     availableStocks: 600,
  //     sampleImg: [
  //       "https://thumbs.dreamstime.com/b/black-saree-8535408.jpg?w=768",
  //     ],
  //     stoneDeails: [],
  //     designDetails: [],
  //     jobWorkDetails: [],
  //     total: 1500,
  //   },
  //   {
  //     date: "15/02/2024",
  //     partyName: "Anamika inter",
  //     designNo: "4",
  //     availableStocks: 754,
  //     sampleImg: [
  //       "https://thumbs.dreamstime.com/b/seamless-colorful-border-traditional-asian-design-elements-seamless-colorful-border-traditional-asian-design-elements-165011556.jpg?w=992",
  //     ],
  //     stoneDeails: [],
  //     designDetails: [],
  //     jobWorkDetails: [],
  //     total: 950,
  //   },
  // ];
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };
  const dataPie = [
    {
      name: "Seoul",
      population: 215,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Toronto",
      population: 280,
      color: "green",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];
  useEffect(() => {
    if (designsMaster && designsMaster.length) {
      const all: any = [...designsMaster];
      const groupedByPartyName: any = all.length && Object.values(
        all.reduce((acc: any, obj: any) => {
          const { partyName }: any = obj;
          if (!acc[partyName]) {
            acc[partyName] = { partyName, data: [] };
          }
          acc[partyName].data.push(obj);
          return acc;
        }, {})
      );
      setBarChart({
        labels: groupedByPartyName.map((party: any) => party.partyName),
        datasets: [
          {
            data: groupedByPartyName.map((party: any) =>
              party.data.reduce(
                (total: any, sample: any) => total + sample.availableStocks,
                0
              )
            ),
          },
        ],
      });
    }
  }, [designsMaster]);
  useEffect(() => {
    dispatch(setLoading(true));

    if (deliveredDesigns && designsMaster && deliveredDesigns.length && designsMaster.length) {
      const all: any = [...deliveredDesigns];
      const allPending: any = [...designsMaster];
      const totalAvailableStocks = all.reduce(
        (total: any, sample: any) => total + sample.availableStocks,
        0
      );
      const totalAvailableStocksPending = allPending.reduce(
        (total: any, sample: any) => total + sample.availableStocks,
        0
      );
      setPieData([
        Number(totalAvailableStocksPending),
        Number(totalAvailableStocks),
      ]);
      setPieChart([
        {
          name: "Pending",
          population: totalAvailableStocksPending,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Delivered",
          population: totalAvailableStocks,
          color: "green",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
      ]);
    }
    dispatch(setLoading(false));
  }, [deliveredDesigns, designsMaster]);

  return (
    <SafeAreaView
      style={[
        GlobalStyle.safeAreaCotainer,
        { height: "100%", marginBottom: 300 },
      ]}
    >
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content" // Here is where you change the font-color
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Pending VS Delivered Stock</Text>
          <View
            style={{
              backgroundColor: "#f5f6f7",
              width: chartWidth,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PieChart
                widthAndHeight={250}
                series={pieData}
                sliceColor={sliceColor}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 30,
                paddingTop: 10,
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Icon name="circle" size={20} color={"green"} />
                <Text style={{ color: "gray" }}>Completed :{pieData[1]}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Icon
                  name="circle"
                  color={"rgba(131, 167, 234, 1)"}
                  size={20}
                />
                <Text style={{ color: "gray" }}>Pending :{pieData[0]}</Text>
              </View>
            </View>
          </View>

          {/* <PieChart
            data={pieChart}
            width={300}
            height={250}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                alignItems: "center",
                justifyContent: "flex-end",
              },
            }}
            accessor={"population"}
            backgroundColor={"#f5f6f7"}
            paddingLeft={"15"}
            center={[10, 10]}
            absolute
          /> */}
        </View>
        <View style={[styles.container, { marginBottom: 60 }]}>
          <Text style={styles.title}>Party Wise Stock</Text>
          <BarChart
            data={barChart}
            width={chartWidth}
            height={250}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: "#f5f6f7",
              backgroundGradientFrom: "#f5f6f7",
              backgroundGradientTo: "#f5f6f7",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            yAxisSuffix=""
            verticalLabelRotation={0}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
});
export default Dashboard;
