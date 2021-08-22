
import React, { Component } from "react";

import Colors from "../Config/Colors";



const TestListItem = (props) => {
    const isUploaded = props.isUploaded;
    const itemData = props.itemData;
    const onItemPress = () => {
                console.log("onItemPressTest", itemData.title);
            };
    
  return (
    <div style={props.containerStyle}>
      <div onClick={onItemPress}>
                  <div
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ flex: 2 }}>{itemData.title}</div>
                    {(!isUploaded) && (<div
                      style={{
                        backgroundColor: "orange",
                        flex: 1,
                        paddingLeft: 2,
                        paddingRight: 2,
                        divAlign: "center",
                        marginRight: 20,
                        borderRadius: 50,
                        color: "white",
                      }}
                    >
                      Pending
                    </div>)}
                    
                    <div
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <div style={{ paddingRight: 20 }}>750</div>
                      {/* <Icon
                        name={isUploaded?"ios-arrow-forward":"upload" }
                        type={isUploaded? "ionicon": "feather"}
                        color={Colors.primaryColor}
                        size={18}
                        containerStyle={{
                          width: 30,
                        }}
                      ></Icon> */}
                      
                    </div>
                  </div>
                </div>
    </div>
  );
};

export default TestListItem

TestListItem.defaultProps = {
  isUploaded: true,
  itemData: "",
  containerStyle: {padding: 5}
}