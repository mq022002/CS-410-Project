import React, { useState } from "react";
import axios from "axios";
import { Tabs, Tab } from "@mui/material";
import CarForm from "./CarForm";

export default function CarInfo() {
  const [data, setData] = useState({ recalls: [], ratings: [] });
  const [errorMessage, setErrorMessage] = useState("");
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [activeRecallTab, setActiveRecallTab] = useState(0);

  const fetchData = async (year, make, model) => {
    try {
      const response = await axios.get(
        `/api/fetchData?year=${year}&make=${make}&model=${model}`
      );
      setData({
        recalls: response.data.recalls,
        ratings: response.data.ratings,
      });
      setErrorMessage("");
      setHasFetchedData(true);
    } catch (error) {
      setErrorMessage("Error fetching data. Please try again.");
      setHasFetchedData(false);
    }
  };

  const handleRecallTabChange = (event, newValue) => {
    setActiveRecallTab(newValue);
  };

  const RecallInfoBox = ({ recallItem }) => (
    <div className="border border-gray-300 rounded p-4 my-2">
      <h2 className="text-lg font-semibold">
        Component: {recallItem.Component}
      </h2>
      <p className="text-base">Summary: {recallItem.Summary}</p>
      <p className="text-sm">Consequence: {recallItem.Consequence}</p>
      <p className="text-sm">Remedy: {recallItem.Remedy}</p>
    </div>
  );

  const RatingInfoBox = ({ ratingItem }) => (
    <div className="border border-gray-300 rounded p-4 my-2">
      <h2 className="text-lg font-semibold">
        Vehicle: {ratingItem.VehicleDescription}
      </h2>
      <p className="text-base">Overall Rating: {ratingItem.OverallRating}</p>
      <p className="text-sm">
        Front Crash Rating: {ratingItem.OverallFrontCrashRating}
      </p>
      <p className="text-sm">
        Side Crash Rating: {ratingItem.OverallSideCrashRating}
      </p>
      <p className="text-sm">Rollover Rating: {ratingItem.RolloverRating}</p>
      <p className="text-sm">
        Electronic Stability Control:{" "}
        {ratingItem.NHTSAElectronicStabilityControl}
      </p>
      <p className="text-sm">
        Forward Collision Warning: {ratingItem.NHTSAForwardCollisionWarning}
      </p>
      <p className="text-sm">
        Lane Departure Warning: {ratingItem.NHTSALaneDepartureWarning}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto p-5">
      <div
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2 text-black"
        style={{ padding: "50px 20px", width: "auto", margin: "20px auto" }}
      >
        <h2 className="text-[#832C31] text-lg font-bold mb-5">
          Get Vehicle Information
        </h2>

        <CarForm fetchData={fetchData} />

        {errorMessage && (
          <p className="text-[#832C31] text-center mt-5">{errorMessage}</p>
        )}

        {hasFetchedData && (
          <div className="flex justify-between mt-2">
            <div className="w-1/2 pr-2">
              <h2 className="text-lg font-semibold">Rating Information</h2>
              {data.ratings.map((ratingItem, index) => (
                <RatingInfoBox key={index} ratingItem={ratingItem} />
              ))}
            </div>
            <div className="w-1/2 pl-2">
              {data.recalls.length > 0 ? (
                <>
                  <Tabs
                    value={activeRecallTab}
                    onChange={handleRecallTabChange}
                    orientation="vertical"
                    variant="scrollable"
                    className="overflow-auto"
                  >
                    {data.recalls.map((recall, index) => (
                      <Tab
                        key={index}
                        label={<p className="text-xs">{recall.Component}</p>}
                      />
                    ))}
                  </Tabs>
                  <div className="pt-3">
                    <h2 className="text-lg font-semibold">
                      Recall Details for{" "}
                      {data.recalls[activeRecallTab].Component}
                    </h2>
                    <RecallInfoBox recallItem={data.recalls[activeRecallTab]} />
                  </div>
                </>
              ) : (
                <p>No recall information available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
