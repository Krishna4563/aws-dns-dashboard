import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);

  //to Create records
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");

  //to update/delete records
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/records")
      .then((response) => {
        console.log("Received data:", response.data);
        setDomains(response.data);
      })
      .catch((error) => {
        console.error("Error fetching domains:", error);
      });
  }, [domains]);

  const handleSelectDomain = (domain) => {
    setSelectedDomain(domain);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/create", {
        name,
        type,
        value,
      })
      .then(() => {
        console.log("New Record Created");
        setName("");
        setType("");
        setValue("");
      })
      .catch((error) => console.error("Error creating record:", error));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/update", {
        selectedDomain: selectedDomain,
        newName: newName,
        newType: newType,
        newValue: newValue,
      })
      .then(() => {
        console.log("Record Updated");
        setSelectedDomain(null);
        setNewName("");
        setNewType("");
        setNewValue("");
      })
      .catch((error) => console.error("Error updating record:", error));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/delete", {
        selectedDomain: selectedDomain,
      })
      .then(() => {
        alert("Record Deleted Successfully !");
        setSelectedDomain(null);
      })
      .catch((error) => console.error("Error deleting record:", error));
  };

  return (
    <div className="flex justify-center items-center p-8">
      <div className="flex flex-col justify-between w-full md:w-[85%] gap-8">
        <h1 className="text-2xl font-bold text-center">
          DNS MANAGEMENT DASHBOARD
        </h1>
        <div className="overflow-x-auto">
          <table className="border border-red-500 w-full">
            <thead className="">
              <tr className="bg-red-300">
                <th className="border border-red-500 px-4 py-2">Select</th>
                <th className="border border-red-500 px-4 py-2">Record Name</th>
                <th className="border border-red-500 px-4 py-2">Type</th>
                <th className="border border-red-500 px-4 py-2">Value</th>
                <th className="border border-red-500 px-4 py-2">TTL</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain, index) => (
                <tr
                  key={index}
                  onClick={() => handleSelectDomain(domain)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="border border-red-500 px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedDomain === domain}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectDomain(domain);
                      }}
                    />
                  </td>
                  <td className="border border-red-500 px-4 py-2">
                    {domain.name}
                  </td>
                  <td className="border border-red-500 px-4 py-2">
                    {domain.type}
                  </td>
                  <td className="border border-red-500 px-4 py-2">
                    {domain.value}
                  </td>
                  <td className="border border-red-500 px-4 py-2">
                    {domain.TTL}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedDomain && (
          <div className="border border-gray-600 shadow-md rounded-md py-6 px-4 flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Update Record :</h1>
            <div className="flex flex-col gap-4">
              <p>
                <strong>Selected Record :</strong>{" "}
                <span>{selectedDomain.name}</span>
              </p>
              <p className=" text-sm">
                (Do the necessary changes for the selected domain record.)
              </p>
            </div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  placeholder="Name"
                  type="text"
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-[25%]"
                />
                <select
                  id="type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  required
                  className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-[25%]"
                >
                  <option value="">Select Type</option>
                  <option value="A">A</option>
                  <option value="AAAA">AAAA</option>
                  <option value="CNAME">CNAME</option>
                  <option value="MX">MX</option>
                  <option value="TXT">TXT</option>
                  <option value="PTR">PTR</option>
                  <option value="SRV">SRV</option>
                  <option value="SPF">SPF</option>
                  <option value="NAPTR">NAPTR</option>
                  <option value="CAA">CAA</option>
                  <option value="DS">DS</option>
                </select>
                <input
                  placeholder="Value"
                  type="text"
                  id="value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  required
                  className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-[25%]"
                />
              </div>
              <div className="flex gap-6">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full md:w-auto"
                >
                  Update Record
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full md:w-auto"
                >
                  Delete Record
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="border border-gray-600 shadow-md rounded-md py-10 px-4 flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Create New Record :</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              placeholder="Name"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-[25%]"
            />
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-[25%]"
            >
              <option value="">Select Type</option>
              <option value="A">A</option>
              <option value="AAAA">AAAA</option>
              <option value="CNAME">CNAME</option>
              <option value="MX">MX</option>
              <option value="TXT">TXT</option>
              <option value="PTR">PTR</option>
              <option value="SRV">SRV</option>
              <option value="SPF">SPF</option>
              <option value="NAPTR">NAPTR</option>
              <option value="CAA">CAA</option>
              <option value="DS">DS</option>
            </select>

            <input
              placeholder="Value"
              type="text"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-[25%]"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[60%] md:w-[25%] lg:w-[15%] text-center"
            >
              Create Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
