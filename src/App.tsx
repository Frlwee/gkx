import { Box, Paper, Button, Menu, MenuItem, TextField, Autocomplete, Icon, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { streets } from './streets';
import { useEffect, useState } from 'react';

interface Debtor {
  id: number;
  address: string;
  house: number;
  apartament: number;
  date: string;
  sum: string;
  telephone: string;
  fio: string;
  status: string;
  payment?: string;
  payment_date?: string;
}

function App() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);

  // TextFields
  const [address, setAddress] = useState("");
  const [house, setHouse] = useState("");
  const [apartament, setApartament] = useState("");
  const [sum, setSum] = useState("");
  const [telephone, setTelephone] = useState("");
  const [fio, setFio] = useState("");
  const [payment, setPayment] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [status, setStatus] = useState("Опечатано");

  // DataGrid Actions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDebtorId, setSelectedDebtorId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, debtorId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedDebtorId(debtorId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    if (selectedDebtorId === null) return;
    const debtor = debtors.find(d => d.id === selectedDebtorId);
    if (!debtor) return;

    // Заполняем форму данными выбранного должника
    setAddress(debtor.address);
    setHouse(String(debtor.house));
    setApartament(String(debtor.apartament));
    setSum(debtor.sum);
    setTelephone(debtor.telephone);
    setFio(debtor.fio);
    setStatus(debtor.status);
    setPayment(debtor.payment || "");
    setPaymentDate(debtor.payment_date || "");

    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDebtorId(null);
  };

  useEffect(() => {
    const storage = localStorage.getItem("debtors");
    if (storage) setDebtors(JSON.parse(storage));
  }, []);

  const handleDelete = () => {
    if (selectedDebtorId === null) return;
    const updated = debtors.filter(d => d.id !== selectedDebtorId);
    setDebtors(updated);
    localStorage.setItem("debtors", JSON.stringify(updated));
    handleClose();
  };

  const handleSaveChanges = () => {
    if (selectedDebtorId === null) return;
    const updated = debtors.map(d => {
      if (d.id === selectedDebtorId) {
        return {
          ...d,
          address,
          house: Number(house),
          apartament: Number(apartament),
          sum,
          telephone,
          fio,
          status,
          payment,
          payment_date: paymentDate,
        };
      }
      return d;
    });
    setDebtors(updated);
    localStorage.setItem("debtors", JSON.stringify(updated));
    handleDialogClose();
  };

  const saveNewDebtor = () => {
    if (!address || !house || !apartament) return;

    const newDebtor: Debtor = {
      id: Date.now(),
      address,
      house: Number(house),
      apartament: Number(apartament),
      date: new Date().toLocaleString(),
      sum,
      telephone,
      fio,
      status,
      payment,
      payment_date: paymentDate,
    };

    const updated = [...debtors, newDebtor];
    setDebtors(updated);
    localStorage.setItem("debtors", JSON.stringify(updated));

    setAddress(""); setHouse(""); setApartament(""); setFio(""); setSum(""); setTelephone(""); setPayment(""); setPaymentDate(""); setStatus("Опечатано");
  };

  const handleSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setSum(formatted);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setPayment(formatted);
  };

  const handleTelephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("7")) value = "7" + value;
    let formatted = "+" + value[0];
    if (value.length > 1) formatted += "-" + value.slice(1, 4);
    if (value.length > 4) formatted += "-" + value.slice(4, 7);
    if (value.length > 7) formatted += "-" + value.slice(7, 9);
    if (value.length > 9) formatted += "-" + value.slice(9, 11);
    setTelephone(formatted);
  };

  // Функция для выгрузки
  const handleExport = () => {
    const dataStr = JSON.stringify(debtors, null, 2); // красивое форматирование
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `debtors_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Функция для загрузки
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setDebtors(json);
          localStorage.setItem("debtors", JSON.stringify(json));
        } else {
          alert("Неверный формат JSON");
        }
      } catch {
        alert("Ошибка при чтении файла");
      }
    };
    reader.readAsText(file);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'address', headerName: 'Адрес', width: 200 },
    { field: 'house', headerName: 'Дом', type: 'number', width: 90 },
    { field: 'apartament', headerName: 'Квартира', type: 'number', width: 110 },
    { field: 'date', headerName: 'Дата', width: 100 },
    { field: 'sum', headerName: 'Сумма', width: 100 },
    { field: 'telephone', headerName: 'Телефон', width: 140},
    { field: 'fio', headerName: 'ФИО', width: 110 },
    { field: 'status', headerName: 'Статус', width: 100 },
    { field: 'payment', headerName: 'Оплата', width: 110 },
    { field: 'payment_date', headerName: 'Дата оплаты', width: 135 },
    // @ts-ignore
    { field: 'actions', headerName: 'Действия', width: 130, renderCell: (params) => (
      <div className="_actions">
        <Icon
          id="basic-button"
          // @ts-ignore
          onClick={(e) => handleClick(e, params.row.id)}
          style={{ cursor: 'pointer' }}
        >
          more_vert
        </Icon>
      </div>
    ) },
  ];

  const paginationModel = { page: 0, pageSize: 20 };

  return (
    <Box padding={2} display={'flex'} justifyContent={'center'}>
      <Paper className="_paper" elevation={3} sx={{ padding: 2, width: '100%' }}>
        <p style={{ fontSize: "20px" }}>Учёт квартир по задолженности</p>
        <Autocomplete
          disablePortal
          options={streets}
          value={address}
          onChange={(_, newValue) => setAddress(newValue || "")}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Адрес" />
          )}
        />
        <div className="hoo" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <TextField fullWidth label="Дом" size="small" variant="outlined" value={house} onChange={(e) => setHouse(e.target.value)} />
          <TextField fullWidth label="Квартира" size="small" variant="outlined" value={apartament} onChange={(e) => setApartament(e.target.value)} />
        </div>
        <div className="hoo" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <TextField fullWidth label="Сумма долга" size="small" variant="outlined" value={sum} onChange={handleSumChange} />
          <TextField fullWidth label="Номер телефона" size="small" variant="outlined" value={telephone} onChange={handleTelephoneChange} />
        </div>
        <TextField sx={{ marginTop: 2 }} fullWidth label="ФИО владельца" size="small" variant="outlined" value={fio} onChange={(e) => setFio(e.target.value)} />
        <TextField
          select
          label="Статус"
          size="small"
          sx={{ marginTop: 2 }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {["Опечатано", "Вручено"].map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>

        {status === "Вручено" && (
          <>
            <TextField sx={{ marginTop: 2 }} fullWidth label="Когда заплатит" size="small" variant="outlined" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            <TextField sx={{ marginTop: 2 }} fullWidth label="Сумма оплаты" size="small" variant="outlined" value={payment} onChange={handlePaymentChange} />
          </>
        )}

        <Button sx={{ marginTop: 2 }} variant="contained" onClick={saveNewDebtor}>Добавить</Button>

        <div className="hoo" style={{ display: 'flex', gap: 10 }}>
          <Button fullWidth onClick={handleExport} sx={{ marginTop: 2 }} variant="contained">
            Выгрузить
          </Button>

          <Button fullWidth sx={{ marginTop: 2 }} variant="contained" component="label">
            Загрузить
            <input type="file" accept=".json" hidden onChange={handleImport} />
          </Button>
        </div>


        <Paper sx={{ marginTop: 10, height: 600, width: '100%' }}>
          <DataGrid
            rows={debtors}
            // @ts-ignore
            columns={columns}
            pageSizeOptions={[20, 30]}
            initialState={{ pagination: { paginationModel } }}
            checkboxSelection
            columnVisibilityModel={{ id: false }}
            sx={{ border: 0 }}
          />
        </Paper>

        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleDialogOpen}>Изменить</MenuItem>
          <MenuItem onClick={handleDelete}>Удалить</MenuItem>
        </Menu>

        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Изменить должника</DialogTitle>
          <DialogContent>
            <Autocomplete disablePortal options={streets} value={address} onChange={(_, newValue) => setAddress(newValue || "")} renderInput={(params) => <TextField {...params} size="small" label="Адрес" />} />
            <div className="hoo" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <TextField fullWidth label="Дом" size="small" variant="outlined" value={house} onChange={(e) => setHouse(e.target.value)} />
              <TextField fullWidth label="Квартира" size="small" variant="outlined" value={apartament} onChange={(e) => setApartament(e.target.value)} />
            </div>
            <div className="hoo" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <TextField fullWidth label="Сумма долга" size="small" variant="outlined" value={sum} onChange={handleSumChange} />
              <TextField fullWidth label="Номер телефона" size="small" variant="outlined" value={telephone} onChange={handleTelephoneChange} />
            </div>
            <TextField sx={{ marginTop: 2 }} fullWidth label="ФИО владельца" size="small" variant="outlined" value={fio} onChange={(e) => setFio(e.target.value)} />
            <TextField select label="Статус" size="small" sx={{ marginTop: 2 }} value={status} onChange={(e) => setStatus(e.target.value)}>
              {["Опечатано", "Вручено"].map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            {status === "Вручено" && (
              <>
                <TextField sx={{ marginTop: 2 }} fullWidth label="Когда заплатит" size="small" variant="outlined" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                <TextField sx={{ marginTop: 2 }} fullWidth label="Сумма оплаты" size="small" variant="outlined" value={payment} onChange={handlePaymentChange} />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Отмена</Button>
            <Button onClick={handleSaveChanges} variant="contained">Сохранить</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default App;
