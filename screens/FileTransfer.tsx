import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { io, Socket } from 'socket.io-client'

import { useAppSelector } from '../hooks/reduxHooks'
import { fileItem, newFolderRequest, newFileTransfer, fileRequestMessage } from '../types'
import { base64reg } from '../utils/Constants'
import { MaterialIcons } from '@expo/vector-icons'
import styles from './fileTransferStyles'

const FileTransfer: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme)
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(true)
  const [socket, setSocket] = useState<Socket>(io())
  const [socketURL, setSocketURL] = useState('')
  const [roomId, setRoomId] = useState('1234')
  const [_, setState] = useState(false)
  const fileChunk = useRef('')

  const connectServer = () => {
    if (!socket.connected) {
      const newSocket = io(socketURL)
      setSocket(newSocket)
      setTimeout(() => {
        setState((prev) => !prev)
      }, 500)
    }
  }

  useEffect(() => {
    return () => socket.close()
  }, [])

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  useEffect(() => {
    socket.on('connected', (data) => {
      console.log(data)
    })
  }, [socket])

  const handleScan = ({ _, data }) => {
    setScanned(true)
    setSocketURL(data)
  }

  const transferChunks = (data: string, bufferSize: number, totalSize: number, socket: Socket) => {
    let chunk = data.slice(0, bufferSize)
    data = data.slice(bufferSize, data.length)
    socket.emit('respondfile', { file: chunk, size: totalSize })
    if (data.length !== 0) {
      transferChunks(data, bufferSize, totalSize, socket)
    }
  }

  const joinRoom = () => {
    socket.emit('joinRoom', { room: roomId, device: 'phone' })

    socket.on('welcome', (msg) => {
      setState((prev) != !prev)
    })

    socket.on('request', (msg: fileRequestMessage) => {
      const baseDir = msg.basedir === 'docDir' ? FileSystem.documentDirectory : FileSystem.cacheDirectory
      const path = baseDir + msg.path

      FileSystem.readDirectoryAsync(path).then((files) => {
        const fileProms = files.map((fileName) => FileSystem.getInfoAsync(path + '/' + fileName))

        Promise.all(fileProms).then((result) => {
          let tempFiles: fileItem[] = result.map((file) =>
            Object({
              ...file,
              name: file.uri.split('/').pop(),
              selected: false
            })
          )
          socket.emit('respond', { path, files: tempFiles })
        })
      })
        .catch((err) => console.log(err))
    })

    socket.on('readfile', (msg: fileRequestMessage) => {
      const baseDir = msg.basedir === 'docDir' ? FileSystem.documentDirectory : FileSystem.cacheDirectory

      const path = baseDir + msg.path

      FileSystem.readAsStringAsync(path, { encoding: 'base64' })
        .then((file) => { transferChunks(file, 1024 * 300, file.length, socket) })
        .catch((err) => console.log(err))
    })

    socket.on('newfolder', (msg: newFolderRequest) => {
      const newFolderURI = FileSystem.documentDirectory + '/' + msg.path + '/' + msg.name

      FileSystem.getInfoAsync(newFolderURI).then((res) => {
        if (!res.exists) {
          FileSystem.makeDirectoryAsync(newFolderURI)
        }
      })
    })

    socket.on('sendfile', (msg: newFileTransfer) => {
      fileChunk.current += msg.file

      if (msg.file.length === msg.size) {
        const base64Data = fileChunk.current.replace(base64reg, '')
        const newFilePath = FileSystem.documentDirectory + '/' + msg.path + '/' + msg.name

        FileSystem.getInfoAsync(newFilePath).then((res) => {
          if (!res.exists) {
            FileSystem.writeAsStringAsync(newFilePath, base64Data, { encoding: 'base64' })
          }
        })
        fileChunk.current = ''
      }
    })
  }

  return (
    <View style={styles.container}>
      {!scanned && hasPermission && (<BarCodeScanner
        onBarCodeScanner={scanned ? undefined : handleScan}
        style={StyleSheet.absoluteFillObject}
      />)}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={{ color: colors.primary, fontFamily: 'Poppins_400Regular' }}>Socket status:</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={{ color: colors.primary, fontFamily: 'Poppins_400Regular' }}>{socket.connected ? 'Connected' : 'Disconnected'}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={{ color: colors.primary, fontFamily: 'Poppins_400Regular' }}>Socket URL:</Text>
          </View>
          <View style={styles.rowRight}>
            <TextInput
              style={[
                styles.roomInput,
                {
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontFamily: 'Poppins_400Regular'
                }
              ]}
              onChangeText={setSocketURL}
              value={socketURL}
            />
            <TouchableOpacity
              style={styles.scanIcon}
              onPress={() => setScanned((prev) => !prev)}
            >
              <MaterialIcons name='qr-code-scanner' size={36} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={{ color: colors.primary, fontFamily: 'Poppins_400Regular' }}>Room ID:</Text>
          </View>
          <View style={styles.rowRight}>
            <TextInput
              style={[styles.roomInput, { borderColor: colors.primary, color: colors.primary, fontFamily: 'Poppins_400Regular' }]}
              onChangeText={setRoomId}
              value={roomId}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={{ color: colors.primary, fontFamily: 'Poppins_400Regular' }}>Socket ID:</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={{ color: colors.primary, fontFamily: 'Poppins_400Regular' }}>{socket.id}</Text>
          </View>
        </View>
        <Button title='Join Room' onPress={joinRoom} />
        <Button title='Connect' onPress={connectServer} />
        <Button title='Disconnect' onPress={() => {
          socket.close()
          setTimeout(() => {
            setState((prev) => !prev)
          }, 500)
        }} />
      </View>
    </View>
  )
}

export default FileTransfer