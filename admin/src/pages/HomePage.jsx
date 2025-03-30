import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useFetchClient } from '@strapi/strapi/admin';

const HomePage = () => {
  const { get } = useFetchClient();
  const [dropDownData, setDropDownData] = useState();
  const [columns, setColumns] = useState();
  const [tableData, setTableData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [fileName, setFileName] = useState('');

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await get('/csv-export/get/dropdown/values');
        setDropDownData(response.data);
        console.log('respone', response.data);
        console.log('waiting for data', JSON.stringify(response));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dropdown value:', error);
        setIsLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  const handleComboboxChange = async (value) => {
    console.log('value', value);
    setSelectedValue(value);
    if (value) {
      fetchUsers(value, 1, 10);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get('/csv-export/download/csv', {
        responseType: 'arraybuffer',
        params: {
          uid: selectedValue,
        },
      });

      if (response.data) {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const downloadFileName = `file-${formattedDate}.csv`;
        setFileName(downloadFileName);

        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = downloadFileName;
        link.click();

        setIsSuccessMessage(true);
        setTimeout(() => {
          setIsSuccessMessage(false);
        }, 8000);
      }
    } catch (error) {
      console.error('Error downloading csv file:', error);
    }
  };

  const handleComboBoxClear = () => {
    setSelectedValue(null);
    setTableData([]);
  };

  const columnRestructure = columns?.map((property) => ({
    name: property?.charAt(0).toUpperCase() + property?.slice(1).replace(/_/g, ' '),
    selector: (row) => row[property],
  }));

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
  };

  const fetchUsers = async (value, page, newPerPage) => {
    setLoading(true);
    const currentSelectedValue = value;

    if (currentSelectedValue) {
      try {
        const offset = (page - 1) * newPerPage;
        const limit = newPerPage;

        const response = await get(
          `/csv-export/get/table/data?uid=${value}&limit=${limit}&offset=${offset}`
        );

        console.log('table-response', JSON.stringify(response));
        if (response?.data?.columns) {
          setColumns(response.data.columns);
        }
        if (response?.data?.data) {
          setTableData(response.data.data);
          setTotalRows(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (page) => {
    fetchUsers(selectedValue, page, perPage);
  };

  const handlePerRowsChange = async (newPerPage, currentPage) => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * newPerPage;
      const limit = newPerPage;

      const response = await axios.get(
        `/excel-export/get/table/data?uid=${selectedValue}&limit=${limit}&offset=${offset}`
      );

      if (response?.data?.data) {
        setTableData(response.data.data);
        setPerPage(newPerPage);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '20px', backgroundColor: '' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Excel Download</h1>
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label
                htmlFor="collectionType"
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
              >
                Collection Type
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="collectionType"
                  value={selectedValue || ''}
                  onChange={(e) => handleComboboxChange(e.target.value)}
                  style={{
                    width: '300px',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                  }}
                >
                  <option value="">Select collection type</option>
                  {dropDownData?.data?.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {selectedValue && (
                  <button
                    onClick={handleComboBoxClear}
                    style={{
                      width: '300px',
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {selectedValue && (
              <>
                <button
                  onClick={handleDownloadCSV}
                  style={{
                    width: '300px',
                    padding: '10px 16px',
                    backgroundColor: '#4945ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  Download
                </button>

                {isSuccessMessage && (
                  <div
                    style={{
                      color: '#2da44e',
                      padding: '12px',
                      backgroundColor: '#f6fef9',
                      borderRadius: '4px',
                    }}
                  >
                    Download completed: {fileName} successfully downloaded!
                  </div>
                )}

                <DataTable
                  pagination
                  columns={columnRestructure}
                  data={tableData}
                  progressPending={loading}
                  paginationServer
                  paginationTotalRows={totalRows}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
