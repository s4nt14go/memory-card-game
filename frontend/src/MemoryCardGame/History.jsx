import {useEffect, useState} from "react";
import './History.css';
import backgroundImg from "../assets/images/play.gif";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import {ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon} from "lucide-react";
import {styled} from "@mui/system";
import {Box} from "@mui/material";

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) throw Error("API URL is not defined");

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('gameDate', {
    header: 'Game date',
    cell: (props) => new Date(props.getValue()).toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).replace(/,/g, ''),
  }),
  columnHelper.accessor('completed', {
    header: 'Completed',
    cell: (props) => {
      return props.getValue() ? '✅' : '❌';
    },
  }),
  columnHelper.accessor('difficulty', {
    header: 'Difficulty',
  }),
  columnHelper.accessor('failed', {
    header: 'Failed',
  }),
  columnHelper.accessor('timeTaken', {
    header: 'Time taken',
  }),
]

const History = ({onLogout}) => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
    sortField: 'gameDate',
    sortDir: 'desc',
    rowCount: 0,
  });

  const [fetchInFlight, setFetchInFlight] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { pageIndex, pageSize, sortField, sortDir } = pagination;
        const response = await axios.get(`${apiUrl}/api/memory/list?pageSize=${pageSize}&pageNumber=${pageIndex + 1}&sortField=${sortField}&sortDir=${sortDir}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setGames(response.data.games);
        setPagination({
          ...pagination,
          rowCount: response.data.count,
          pageIndex,
        });
        setErrors([]);
      } catch (error) {
        console.log({error});

        if (error.status === 401) {
          console.log('Unauthenticated, logging out');
          onLogout();
        }

        let _errors;
        if (error.response?.data && Array.isArray(error.response.data)) {
          console.log('Array of errors coming from backend');
          _errors = error.response.data;
        } else {
          console.log('Axios error');
          _errors = [{
            type: error.name,
            message: error.message,
          }]
        }
        setErrors(_errors);
      } finally {
        setFetchInFlight(false);
      }
  }
  if (!fetchInFlight) {
    void fetchHistory();
    setFetchInFlight(true);
  }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    pagination.sortField,
    pagination.sortDir,
  ]);
  console.log({pagination});

  const [sorting, setSorting] = useState(
    [
      {
        id: pagination.sortField,
        desc: pagination.sortDir === 'desc',
        asc: pagination.sortDir === 'asc',
      },
    ]
  );

  const table = useReactTable({
    data: games,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: pagination.rowCount,
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
  })

  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <div
      className="background-container"
      style={{
        justifyContent: 'unset',
        backgroundImage: `url(${backgroundImg})`,
      }}
    >
      <h1 className={`game-title`}>
        WonderCards
      </h1>

      <PixelButton onClick={() => navigate("/play")} sx={{alignSelf: "flex-start", margin: 2}}>
        Back
      </PixelButton>

      <div className={`button-container`}>
        <table className={`table`}>
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}
                    className="table-header"
                >
                  <div
                    {...{
                      className: header.column.getCanSort() ? 'cursor-pointer' : '',
                      onClick: () => {
                        let nextSortingOrder = header.column.getNextSortingOrder();
                        if (!nextSortingOrder) {
                          // console.log('skip nextSortingOrder = false, use asc')
                          nextSortingOrder = 'asc';
                        }
                        setPagination({
                          ...pagination,
                          sortField: header.column.id,
                          sortDir: nextSortingOrder,
                        });
                        setSorting([
                          {
                            id: header.column.id,
                            desc: nextSortingOrder === 'desc',
                            asc: nextSortingOrder === 'asc',
                          },
                        ]);
                      }
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <span>&nbsp;↑</span>,
                      desc: <span>&nbsp;↓</span>,
                    }[header.column.getIsSorted()] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info font">
            <span>
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong>.
            </span>&nbsp;
            <span className="block">
              Total results:&nbsp;
              <strong>{pagination.rowCount}</strong>
            </span>
          </div>

          <div className="pagination-buttons-container">
            <button
              className={`p-3 rounded
          ${!canPreviousPage || fetchInFlight ? 'disabled' : 'hover:bg-hover'}  
        `}
              onClick={() => table.setPageIndex(0)}
              disabled={!canPreviousPage || fetchInFlight}
            >
              <ChevronsLeftIcon className="h-6 w-6 inline"/>
            </button>
            <button
              className={`p-3 rounded
          ${!canPreviousPage || fetchInFlight ? 'disabled' : 'hover:bg-hover'}  
        `}
              onClick={() => table.previousPage()}
              disabled={!canPreviousPage || fetchInFlight}
            >
              <ChevronLeftIcon className="h-6 w-6 inline"/>
            </button>
            &nbsp;
            <button
              className={`p-3 rounded
          ${!canNextPage ? 'disabled' : 'hover:bg-hover'}  
        `}
              onClick={() => table.nextPage()}
              disabled={!canNextPage || fetchInFlight}
            >
              <ChevronRightIcon className="h-6 w-6 inline"/>
            </button>
            <button
              className={`p3 rounded
          ${!canNextPage || fetchInFlight? 'disabled' : 'hover:bg-hover'}
        `}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!canNextPage}
            >
              <ChevronsRightIcon className="h-6 w-6 inline"/>
            </button>
          </div>
        </div>

        {/* Page size */}
        <div>
        <label htmlFor="items_per_page" className="font per-page-label">
          Items per page
        </label>
        <div className="select-container">
          <select
            disabled={fetchInFlight}
            id="items_per_page"
            className={`select
              ${fetchInFlight && 'disabled'}
            `}
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              setPagination({
                ...pagination,
                pageSize: Number(e.target.value),
              })
            }}
          >
            {[5, 10].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        </div>

        { !!errors.length && errors.map(e => <p className={'error'} key={e.type}>{e.message}</p>) }

      </div>

    </div>
  );
};

export default History;

const PixelButton = styled(Box)(() => ({
  display: "inline-block",
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",

  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));