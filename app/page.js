'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
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

// Styles
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

const darkPinkColor = '#C71585'

// Component
export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [welcomeMessageOpen, setWelcomeMessageOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [username, setUsername] = useState('User')
  const [profilePicture, setProfilePicture] = useState('')

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

  const handleNotificationOpen = () => setNotificationOpen(true)
  const handleNotificationClose = () => setNotificationOpen(false)

  const handleWelcomeMessageOpen = () => {
    handleNotificationClose()
    setWelcomeMessageOpen(true)
  }
  const handleWelcomeMessageClose = () => setWelcomeMessageOpen(false)

  const handleProfileOpen = () => setProfileOpen(true)
  const handleProfileClose = () => setProfileOpen(false)

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
      bgcolor="#fff0f5"
      position="relative"
      p={2}
      overflow="auto"  // Add this line to make the page scrollable
    >

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

      {/* Modal for Notifications */}
      <Modal
        open={notificationOpen}
        onClose={handleNotificationClose}
        aria-labelledby="notification-modal-title"
        aria-describedby="notification-modal-description"
      >
        <Box sx={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <Typography id="notification-modal-title" variant="h6" component="h2" mb={2}>
            Notification
          </Typography>
          <Button variant="contained" sx={buttonStyle} onClick={handleWelcomeMessageOpen}>
            Show Welcome Message
          </Button>
        </Box>
      </Modal>

      {/* Modal for Welcome Message */}
      <Modal
        open={welcomeMessageOpen}
        onClose={handleWelcomeMessageClose}
        aria-labelledby="welcome-message-modal-title"
        aria-describedby="welcome-message-modal-description"
      >
        <Box sx={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <Typography id="welcome-message-modal-title" variant="h6" component="h2" mb={2} sx={{ color: darkPinkColor }}>
            Welcome to Lettuce Cook!
          </Typography>
          <Typography id="welcome-message-modal-description" mb={2} sx={{ color: darkPinkColor }}>
            Thank you for using the Lettuce Cook App. We hope you find it helpful!
          </Typography>
          <Button variant="contained" sx={buttonStyle} onClick={handleWelcomeMessageClose}>
            Close
          </Button>
        </Box>
      </Modal>

      {/* Modal for Profile */}
      <Modal
        open={profileOpen}
        onClose={handleProfileClose}
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
      >
        <Box sx={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <Typography id="profile-modal-title" variant="h6" component="h2" mb={2}>
            Profile
          </Typography>
          <Box mb={2}>
            {profilePicture && (
              <img src={profilePicture} alt="Profile" style={{ borderRadius: '50%', width: 100, height: 100 }} />
            )}
            <TextField
              type="file"
              variant="outlined"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => setProfilePicture(reader.result)
                  reader.readAsDataURL(file)
                }
              }}
              fullWidth
              margin="normal"
            />
          </Box>
          <TextField
            variant="outlined"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" sx={buttonStyle} onClick={handleProfileClose}>
            Save
          </Button>
        </Box>
      </Modal>

      {/* Main Content */}
      <Box
        width="100%"
        flex="1"  // Allow the content to grow and take available space
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        overflow="auto"  // Make this container scrollable
      >
        <Typography variant="h3" color="#FF69B4" textAlign="center" gutterBottom>
          Inventory Management
        </Typography>
        <Button variant="contained" sx={buttonStyle} onClick={handleOpen} style={{ display: 'block', margin: '0 auto' }}>
          Add New Item
        </Button>
        <Box
          borderRadius={3}
          width="800px"
          boxShadow="0px 3px 6px rgba(0, 0, 0, 0.1)"
          bgcolor="white"
          overflow="hidden"
          mt={2}
          textAlign="center"
        >
          <Box
            bgcolor="#FFB6C1"
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
              <Box key={name} sx={cardStyle}>
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
      </Box>

      {/* Footer */}
      <Box
        width="100%"
        p={2}
        bgcolor="#FFB6C1"
        position="absolute"
        bottom={0}
        textAlign="center"
      >
        <Typography variant="body2" color="white">
          © 2024 Lettuce Cook
        </Typography>
      </Box>
    </Box>
  )
}
