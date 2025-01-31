import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import axios from "axios";
import { AsyncSearchableCombobox } from "./components/custom/async-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Input } from "./components/ui/input";
import { Circle, MapPin, Search, User } from "lucide-react";
import { DatePicker } from "./components/custom/date-picker";
import { DatePickerWithRange } from "./components/custom/date-range-picker";
import { DateRange } from "react-day-picker";
import travelSvg from "./assets/travel.svg";
import { format } from "date-fns";
import { formatMinutesToHoursAndMinutes } from "./lib/utils";

const rapidApiKey = process.env.VITE_API_KEY;

function App() {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [originAirportOptions, setOriginAirportOptions] = useState([]);
  const [destinationAirportOptions, setDestinationAirportOptions] = useState(
    []
  );
  const [passengers, setPassengers] = useState("1");
  const [tripType, setTripType] = useState("rt");
  const [tripClass, setTripClass] = useState("economy");

  const [airportsLoading, setAirportsLoading] = useState(false);
  const [flightsLoading, setFlightsLoading] = useState(false);

  const [origin, setOrigin] = useState<any>({});
  const [destination, setDestination] = useState<any>({});

  const [flightDateRange, setFlightDateRange] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  });
  const [departureDate, setDepartureDate] = useState<Date>(new Date());

  const [originSearchKey, setOriginSearchKey] = useState("");
  const [destinationSearchKey, setDestinationSearchKey] = useState("");

  const [searchResults, setSearchResults] = useState<any>({});

  const getNearestAirports = async (coords: GeolocationCoordinates) => {
    const options = {
      method: "GET",
      url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/getNearByAirports",
      params: {
        lat: coords.latitude,
        lng: coords.longitude,
        locale: "en-US",
      },
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    };
    try {
      setAirportsLoading(true);
      const response = await axios.request(options);
      const formattedOptions = response.data.data.nearby.map(
        (airport: any) => ({
          value: airport,
          label: airport.presentation.suggestionTitle,
        })
      );
      console.log(response.data.data.nearby);
      console.log("formatted", formattedOptions);
      setOriginAirportOptions(formattedOptions);
      setDestinationAirportOptions(formattedOptions);
      setOrigin(formattedOptions[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setAirportsLoading(false);
    }
  };

  const handleAirportSearch = async (
    query: string,
    onSuccessSetAirports: Function
  ) => {
    const options = {
      method: "GET",
      url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
      params: {
        query: query,
        locale: "en-US",
      },
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    };

    try {
      setAirportsLoading(true);
      const response = await axios.request(options);
      const formattedOptions = response.data.data.map((airport: any) => ({
        value: airport,
        label: airport.presentation.suggestionTitle,
      }));
      console.log(response.data);
      // setAirportOptions(formattedOptions);
      onSuccessSetAirports(formattedOptions);
    } catch (error) {
      console.error(error);
    } finally {
      setAirportsLoading(false);
    }
  };

  const handleFlightSearch = async () => {
    const options = {
      method: "GET",
      url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
      params: {
        originSkyId: origin.value?.navigation.relevantFlightParams.skyId,
        destinationSkyId:
          destination.value?.navigation.relevantFlightParams.skyId,
        originEntityId: origin.value?.navigation.relevantFlightParams.entityId,
        destinationEntityId:
          destination.value?.navigation.relevantFlightParams.entityId,
        cabinClass: tripClass,
        adults: passengers,
        date: format(departureDate, "yyyy-MM-dd"),
        sortBy: "best",
        currency: "USD",
        market: "en-US",
        countryCode: "US",
      },
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    };
    if (!origin.label) {
      alert("Please select origin");
    } else if (!destination.label) {
      alert("Please select destination");
    } else {
      setFlightsLoading(true);
      try {
        const response = await axios.request(options);
        setSearchResults(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setFlightsLoading(false);
      }
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation(position.coords);
            getNearestAirports(position.coords);
          },
          (error) => {
            console.log(error.message);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (originSearchKey)
      handleAirportSearch(originSearchKey, setOriginAirportOptions);
  }, [originSearchKey]);
  useEffect(() => {
    if (destinationSearchKey)
      handleAirportSearch(destinationSearchKey, setDestinationAirportOptions);
  }, [destinationSearchKey]);

  return (
    <>
      <div
        style={{ backgroundImage: `url(${travelSvg})` }}
        className="bg-cover bg-center h-[25vw] max-h-[300px] rounded-lg mb-4 relative"
      >
        <h1 className="text-5xl font-normal mb-4 absolute bottom-0 left-1/2 -translate-x-1/2">
          Flights
        </h1>
      </div>
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg pt-2 pb-12 px-4 max-md:pb-9 relative">
          <div className="w-full flex gap-1 mb-2">
            <Select defaultValue={tripType} onValueChange={setTripType}>
              <SelectTrigger className="p-2 text-xs w-[100px] hover:bg-slate-50 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rt">Round trip</SelectItem>
                <SelectItem value="ow">One way</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <User
                className="text-muted-foreground absolute top-1/2 -translate-y-1/2 left-1"
                size={16}
              />
              <Input
                className="p-2 pl-7 w-[65px] text-xs hover:bg-slate-50 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none"
                type="number"
                style={{ fontSize: "0.75rem" }}
                min={1}
                max={9}
                defaultValue={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              />
            </div>
            <Select defaultValue={tripClass} onValueChange={setTripClass}>
              <SelectTrigger className="gap-1 p-2 text-xs w-fit hover:bg-slate-50 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium-economy">Premium economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4 max-md:h-[108px] h-[56px]">
            <div className="grid grid-cols-2 md:col-span-2 lg:col-span-3 gap-2">
              <div className="relative">
                <AsyncSearchableCombobox
                  label={origin.label}
                  placeholder="Where from?"
                  inputValue={originSearchKey}
                  onInputChange={setOriginSearchKey}
                  onSelect={setOrigin}
                  isLoading={airportsLoading}
                  options={originAirportOptions}
                  icon={<Circle size={12} />}
                />
              </div>
              <div>
                <AsyncSearchableCombobox
                  label={destination.label}
                  placeholder="Where to?"
                  inputValue={destinationSearchKey}
                  onInputChange={setDestinationSearchKey}
                  onSelect={setDestination}
                  isLoading={airportsLoading}
                  options={destinationAirportOptions}
                  icon={<MapPin size={12} />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:col-span-2 lg:col-span-2 gap-0">
              {tripType === "rt" && (
                <div>
                  <DatePickerWithRange
                    onDatesChange={setFlightDateRange}
                    selectedDate={flightDateRange}
                  />
                </div>
              )}
              {tripType === "ow" && (
                <div>
                  <DatePicker
                    selectedDate={departureDate}
                    onDateChange={setDepartureDate}
                  />
                </div>
              )}
            </div>
          </div>
          <Button
            className="bg-[#0066CC] hover:bg-[#0044AF] absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 rounded-full shadow-xl"
            onClick={() => handleFlightSearch()}
            disabled={flightsLoading}
          >
            <Search />
            Explore
          </Button>
        </div>
        <div className="mt-9 flex flex-col gap-2">
          {flightsLoading && <p>Loading...</p>}
          {searchResults?.status &&
            searchResults.data.itineraries.map((itinerary: any) => (
              <>
                <div
                  key={itinerary.id}
                  className="p-4 bg-slate-50 rounded-md flex gap-4 max-md:flex-col"
                >
                  <div className="flex items-center gap-2 basis-[22%]">
                    <img
                      className="h-6 w-6 rounded-full"
                      src={itinerary.legs[0].carriers.marketing[0].logoUrl}
                    />
                    <p className="ml-2 text-sm text-muted-foreground">
                      {itinerary.legs[0].carriers.marketing[0].name}
                    </p>
                  </div>
                  <div>
                    {itinerary.legs[0].origin.city} -{" "}
                    {itinerary.legs[0].destination.city}
                    <span className="px-4">
                      {formatMinutesToHoursAndMinutes(
                        itinerary.legs[0].durationInMinutes
                      )}
                    </span>
                  </div>
                  <div className="ml-auto">{itinerary.price.formatted}</div>
                </div>
              </>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
