'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Switch } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

// Styles for modal and buttons
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #FFC0CB',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  transition: 'all 0.3s ease-in-out',
}

const buttonStyle = {
  bgcolor: '#FF69B4',
  color: 'white',
  '&:hover': {
    bgcolor: '#FF1493',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
}

const cardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  p: 2,
  bgcolor: '#ffe4e1',
  borderRadius: 2,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
}

// Theme Objects
const lightTheme = {
  background: '#fff0f5',
  header: '#FFB6C1',
  card: '#ffe4e1',
  text: 'black',
}

const darkTheme = {
  background: '#3a0a4e',
  header: '#5e2750',
  card: '#7b3c6e',
  text: 'white',
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const currentTheme = darkMode ? darkTheme : lightTheme

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const incrementItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const toggleFavorite = async (item, isFavorite) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await setDoc(docRef, { favorite: !isFavorite }, { merge: true })
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Filter items based on search query
  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      bgcolor={currentTheme.background}
      color={currentTheme.text}
      position="relative"
      p={2}
    >
      {/* Theme Switch */}
      <Box
        position="absolute"
        top={200}
        left={26}
        display="flex"
        alignItems="center"
        bgcolor={currentTheme.background}
        borderRadius={2}
        p={1}
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      >
        <Typography variant="body2" color={currentTheme.text} mr={1}>
          Dark Mode
        </Typography>
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          color="default"
        />
      </Box>

      {/* Header Bar */}
      <Box
        width="100%"
        p={2}
        bgcolor={currentTheme.header}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4" color="white">
          Pantry App
        </Typography>
        <Typography variant="h6" color="white">
          Welcome, User!
        </Typography>
      </Box>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search items..."
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#FFC0CB',
            },
            '&:hover fieldset': {
              borderColor: '#FF69B4',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF69B4',
            },
          },
        }}
      />

      {/* Modal for Adding Items */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Add Item
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              sx={buttonStyle}
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Main Content */}
      <Typography variant="h3" color="#FF69B4" gutterBottom>
        Inventory Management
      </Typography>
      <Button variant="contained" sx={buttonStyle} onClick={handleOpen}>
        Add New Item
      </Button>
      <Box
        borderRadius={3}
        width="800px"
        boxShadow="0px 3px 6px rgba(0, 0, 0, 0.1)"
        bgcolor="white"
        overflow="hidden"
        mt={2}
      >
        <Box
          bgcolor={currentTheme.header}
          p={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" color="white" textAlign="center">
            Inventory Items
          </Typography>
        </Box>
        <Stack p={2} spacing={2} overflow="auto" maxHeight="400px">
          {filteredInventory.map(({ name, quantity, favorite = false }) => (
            <Box key={name} sx={{ ...cardStyle, bgcolor: currentTheme.card }}>
              <Typography variant="h6" color="textPrimary">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="textPrimary">
                Quantity: {quantity}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  variant="contained"
                  size="small"
                  sx={buttonStyle}
                  onClick={() => incrementItem(name)}
                >
                  +
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={buttonStyle}
                  onClick={() => removeItem(name)}
                >
                  -
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ ...buttonStyle, bgcolor: favorite ? '#FFD700' : '#FF69B4' }}
                  onClick={() => toggleFavorite(name, favorite)}
                >
                  {favorite ? '★' : '☆'}
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Footer */}
      <Box
        width="100%"
        p={2}
        bgcolor={currentTheme.header}
        position="absolute"
        bottom={0}
        textAlign="center"
      >
        <Typography variant="body2" color="white">
          © 2024 Pantry App. All rights reserved. - Jasmine Far
        </Typography>
      </Box>
    </Box>
  )
}
