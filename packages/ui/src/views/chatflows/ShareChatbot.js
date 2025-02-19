import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction, SET_CHATFLOW } from 'store/actions'
import { SketchPicker } from 'react-color'

import { Box, Typography, Button, Switch, OutlinedInput, Popover, Stack, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Project import
import { StyledButton } from 'ui-component/button/StyledButton'
import { TooltipWithParser } from 'ui-component/tooltip/TooltipWithParser'

// Icons
import { IconX, IconCopy, IconArrowUpRightCircle } from '@tabler/icons'

// API
import chatflowsApi from 'api/chatflows'

// utils
import useNotifier from 'utils/useNotifier'

// Const
import { baseURL } from 'store/constant'

const defaultConfig = {
    backgroundColor: '#ffffff',
    fontSize: 16,
    poweredByTextColor: '#303235',
    botMessage: {
        backgroundColor: '#f7f8ff',
        textColor: '#303235'
    },
    userMessage: {
        backgroundColor: '#3B81F6',
        textColor: '#ffffff'
    },
    textInput: {
        backgroundColor: '#ffffff',
        textColor: '#303235',
        sendButtonColor: '#3B81F6'
    }
}

const ShareChatbot = () => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const chatflow = useSelector((state) => state.canvas.chatflow)
    const chatflowid = chatflow.id
    const chatbotConfig = chatflow.chatbotConfig ? JSON.parse(chatflow.chatbotConfig) : {}

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [isPublicChatflow, setChatflowIsPublic] = useState(chatflow.isPublic ?? false)

    const [welcomeMessage, setWelcomeMessage] = useState(chatbotConfig?.welcomeMessage ?? '')
    const [backgroundColor, setBackgroundColor] = useState(chatbotConfig?.backgroundColor ?? defaultConfig.backgroundColor)
    const [fontSize, setFontSize] = useState(chatbotConfig?.fontSize ?? defaultConfig.fontSize)
    const [poweredByTextColor, setPoweredByTextColor] = useState(chatbotConfig?.poweredByTextColor ?? defaultConfig.poweredByTextColor)

    const [botMessageBackgroundColor, setBotMessageBackgroundColor] = useState(
        chatbotConfig?.botMessage?.backgroundColor ?? defaultConfig.botMessage.backgroundColor
    )
    const [botMessageTextColor, setBotMessageTextColor] = useState(
        chatbotConfig?.botMessage?.textColor ?? defaultConfig.botMessage.textColor
    )
    const [botMessageAvatarSrc, setBotMessageAvatarSrc] = useState(chatbotConfig?.botMessage?.avatarSrc ?? '')
    const [botMessageShowAvatar, setBotMessageShowAvatar] = useState(chatbotConfig?.botMessage?.showAvatar ?? false)

    const [userMessageBackgroundColor, setUserMessageBackgroundColor] = useState(
        chatbotConfig?.userMessage?.backgroundColor ?? defaultConfig.userMessage.backgroundColor
    )
    const [userMessageTextColor, setUserMessageTextColor] = useState(
        chatbotConfig?.userMessage?.textColor ?? defaultConfig.userMessage.textColor
    )
    const [userMessageAvatarSrc, setUserMessageAvatarSrc] = useState(chatbotConfig?.userMessage?.avatarSrc ?? '')
    const [userMessageShowAvatar, setUserMessageShowAvatar] = useState(chatbotConfig?.userMessage?.showAvatar ?? false)

    const [textInputBackgroundColor, setTextInputBackgroundColor] = useState(
        chatbotConfig?.textInput?.backgroundColor ?? defaultConfig.textInput.backgroundColor
    )
    const [textInputTextColor, setTextInputTextColor] = useState(chatbotConfig?.textInput?.textColor ?? defaultConfig.textInput.textColor)
    const [textInputPlaceholder, setTextInputPlaceholder] = useState(chatbotConfig?.textInput?.placeholder ?? '')
    const [textInputSendButtonColor, setTextInputSendButtonColor] = useState(
        chatbotConfig?.textInput?.sendButtonColor ?? defaultConfig.textInput.sendButtonColor
    )

    const [colorAnchorEl, setColorAnchorEl] = useState(null)
    const [selectedColorConfig, setSelectedColorConfig] = useState('')
    const [sketchPickerColor, setSketchPickerColor] = useState('')
    const openColorPopOver = Boolean(colorAnchorEl)

    const [copyAnchorEl, setCopyAnchorEl] = useState(null)
    const openCopyPopOver = Boolean(copyAnchorEl)

    const formatObj = () => {
        const obj = {
            botMessage: {
                showAvatar: false
            },
            userMessage: {
                showAvatar: false
            },
            textInput: {}
        }
        if (welcomeMessage) obj.welcomeMessage = welcomeMessage
        if (backgroundColor) obj.backgroundColor = backgroundColor
        if (fontSize) obj.fontSize = fontSize
        if (poweredByTextColor) obj.poweredByTextColor = poweredByTextColor

        if (botMessageBackgroundColor) obj.botMessage.backgroundColor = botMessageBackgroundColor
        if (botMessageTextColor) obj.botMessage.textColor = botMessageTextColor
        if (botMessageAvatarSrc) obj.botMessage.avatarSrc = botMessageAvatarSrc
        if (botMessageShowAvatar) obj.botMessage.showAvatar = botMessageShowAvatar

        if (userMessageBackgroundColor) obj.userMessage.backgroundColor = userMessageBackgroundColor
        if (userMessageTextColor) obj.userMessage.textColor = userMessageTextColor
        if (userMessageAvatarSrc) obj.userMessage.avatarSrc = userMessageAvatarSrc
        if (userMessageShowAvatar) obj.userMessage.showAvatar = userMessageShowAvatar

        if (textInputBackgroundColor) obj.textInput.backgroundColor = textInputBackgroundColor
        if (textInputTextColor) obj.textInput.textColor = textInputTextColor
        if (textInputPlaceholder) obj.textInput.placeholder = textInputPlaceholder
        if (textInputSendButtonColor) obj.textInput.sendButtonColor = textInputSendButtonColor

        return obj
    }

    const onSave = async () => {
        try {
            const saveResp = await chatflowsApi.updateChatflow(chatflowid, {
                chatbotConfig: JSON.stringify(formatObj())
            })
            if (saveResp.data) {
                enqueueSnackbar({
                    message: '聊天机器人配置成功',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                dispatch({ type: SET_CHATFLOW, chatflow: saveResp.data })
            }
        } catch (error) {
            console.error(error)
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to save Chatbot Configuration: ${errorData}`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }
    }

    const onSwitchChange = async (checked) => {
        try {
            const saveResp = await chatflowsApi.updateChatflow(chatflowid, { isPublic: checked })
            if (saveResp.data) {
                enqueueSnackbar({
                    message: '聊天机器人配置成功',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                dispatch({ type: SET_CHATFLOW, chatflow: saveResp.data })
            }
        } catch (error) {
            console.error(error)
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to save Chatbot Configuration: ${errorData}`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }
    }

    const handleClosePopOver = () => {
        setColorAnchorEl(null)
    }

    const handleCloseCopyPopOver = () => {
        setCopyAnchorEl(null)
    }

    const onColorSelected = (hexColor) => {
        switch (selectedColorConfig) {
            case 'backgroundColor':
                setBackgroundColor(hexColor)
                break
            case 'poweredByTextColor':
                setPoweredByTextColor(hexColor)
                break
            case 'botMessageBackgroundColor':
                setBotMessageBackgroundColor(hexColor)
                break
            case 'botMessageTextColor':
                setBotMessageTextColor(hexColor)
                break
            case 'userMessageBackgroundColor':
                setUserMessageBackgroundColor(hexColor)
                break
            case 'userMessageTextColor':
                setUserMessageTextColor(hexColor)
                break
            case 'textInputBackgroundColor':
                setTextInputBackgroundColor(hexColor)
                break
            case 'textInputTextColor':
                setTextInputTextColor(hexColor)
                break
            case 'textInputSendButtonColor':
                setTextInputSendButtonColor(hexColor)
                break
        }
        setSketchPickerColor(hexColor)
    }

    const onTextChanged = (value, fieldName) => {
        switch (fieldName) {
            case 'welcomeMessage':
                setWelcomeMessage(value)
                break
            case 'fontSize':
                setFontSize(value)
                break
            case 'botMessageAvatarSrc':
                setBotMessageAvatarSrc(value)
                break
            case 'userMessageAvatarSrc':
                setUserMessageAvatarSrc(value)
                break
            case 'textInputPlaceholder':
                setTextInputPlaceholder(value)
                break
        }
    }

    const onBooleanChanged = (value, fieldName) => {
        switch (fieldName) {
            case 'botMessageShowAvatar':
                setBotMessageShowAvatar(value)
                break
            case 'userMessageShowAvatar':
                setUserMessageShowAvatar(value)
                break
        }
    }

    const colorField = (color, fieldName, fieldLabel) => {
        return (
            <Box sx={{ pt: 2, pb: 2 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography sx={{ mb: 1 }}>{fieldLabel}</Typography>
                    <Box
                        sx={{
                            cursor: 'pointer',
                            width: '30px',
                            height: '30px',
                            border: '1px solid #616161',
                            marginRight: '10px',
                            backgroundColor: color ?? '#ffffff',
                            borderRadius: '5px'
                        }}
                        onClick={(event) => {
                            setSelectedColorConfig(fieldName)
                            setSketchPickerColor(color ?? '#ffffff')
                            setColorAnchorEl(event.currentTarget)
                        }}
                    ></Box>
                </div>
            </Box>
        )
    }

    const booleanField = (value, fieldName, fieldLabel) => {
        return (
            <Box sx={{ pt: 2, pb: 2 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography sx={{ mb: 1 }}>{fieldLabel}</Typography>
                    <Switch
                        id={fieldName}
                        checked={value}
                        onChange={(event) => {
                            onBooleanChanged(event.target.checked, fieldName)
                        }}
                    />
                </div>
            </Box>
        )
    }

    const textField = (message, fieldName, fieldLabel, fieldType = 'string', placeholder = '') => {
        return (
            <Box sx={{ pt: 2, pb: 2 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography sx={{ mb: 1 }}>{fieldLabel}</Typography>
                    <OutlinedInput
                        id={fieldName}
                        type={fieldType}
                        fullWidth
                        value={message}
                        placeholder={placeholder}
                        name={fieldName}
                        onChange={(e) => {
                            onTextChanged(e.target.value, fieldName)
                        }}
                    />
                </div>
            </Box>
        )
    }

    return (
        <>
            <Stack direction='row'>
                <Typography
                    sx={{
                        p: 1,
                        borderRadius: 10,
                        backgroundColor: theme.palette.primary.light,
                        width: 'max-content',
                        height: 'max-content'
                    }}
                    variant='h5'
                >
                    {`${baseURL}/chatbot/${chatflowid}`}
                </Typography>
                <IconButton
                    title='复制链接'
                    color='success'
                    onClick={(event) => {
                        navigator.clipboard.writeText(`${baseURL}/chatbot/${chatflowid}`)
                        setCopyAnchorEl(event.currentTarget)
                        setTimeout(() => {
                            handleCloseCopyPopOver()
                        }, 1500)
                    }}
                >
                    <IconCopy />
                </IconButton>
                <IconButton title='打开新窗口' color='primary' onClick={() => window.open(`${baseURL}/chatbot/${chatflowid}`, '_blank')}>
                    <IconArrowUpRightCircle />
                </IconButton>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Switch
                        checked={isPublicChatflow}
                        onChange={(event) => {
                            setChatflowIsPublic(event.target.checked)
                            onSwitchChange(event.target.checked)
                        }}
                    />
                    <Typography>开放</Typography>
                    <TooltipWithParser style={{ marginLeft: 10 }} title={'开放后将允许任何人在不需要用户名和密码的情况下访问聊天机器人'} />
                </div>
            </Stack>
            {textField(welcomeMessage, 'welcomeMessage', '欢迎语', 'string', '自定义的欢迎语')}
            {colorField(backgroundColor, 'backgroundColor', '背景颜色')}
            {textField(fontSize, 'fontSize', '字体大小', 'number')}
            {colorField(poweredByTextColor, 'poweredByTextColor', '文本颜色')}

            {/*BOT Message*/}
            <Typography variant='h4' sx={{ mb: 1, mt: 2 }}>
                机器人消息
            </Typography>
            {colorField(botMessageBackgroundColor, 'botMessageBackgroundColor', '背景颜色')}
            {colorField(botMessageTextColor, 'botMessageTextColor', '文本颜色')}
            {textField(
                botMessageAvatarSrc,
                'botMessageAvatarSrc',
                '头像链接',
                'string',
                `https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png`
            )}
            {booleanField(botMessageShowAvatar, 'botMessageShowAvatar', '展示头像')}

            {/*USER Message*/}
            <Typography variant='h4' sx={{ mb: 1, mt: 2 }}>
                用户消息
            </Typography>
            {colorField(userMessageBackgroundColor, 'userMessageBackgroundColor', '背景颜色')}
            {colorField(userMessageTextColor, 'userMessageTextColor', '文本颜色')}
            {textField(
                userMessageAvatarSrc,
                'userMessageAvatarSrc',
                '头像链接',
                'string',
                `https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png`
            )}
            {booleanField(userMessageShowAvatar, 'userMessageShowAvatar', '展示头像')}

            {/*TEXT Input*/}
            <Typography variant='h4' sx={{ mb: 1, mt: 2 }}>
                文本输入
            </Typography>
            {colorField(textInputBackgroundColor, 'textInputBackgroundColor', '背景颜色')}
            {colorField(textInputTextColor, 'textInputTextColor', '文本颜色')}
            {textField(textInputPlaceholder, 'textInputPlaceholder', '文本输入占位符', 'string', `输入问题...`)}
            {colorField(textInputSendButtonColor, 'textInputSendButtonColor', '文本发送按钮颜色')}

            <StyledButton style={{ marginBottom: 10, marginTop: 10 }} variant='contained' onClick={() => onSave()}>
                保存
            </StyledButton>
            <Popover
                open={openColorPopOver}
                anchorEl={colorAnchorEl}
                onClose={handleClosePopOver}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
            >
                <SketchPicker color={sketchPickerColor} onChange={(color) => onColorSelected(color.hex)} />
            </Popover>
            <Popover
                open={openCopyPopOver}
                anchorEl={copyAnchorEl}
                onClose={handleCloseCopyPopOver}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
            >
                <Typography variant='h6' sx={{ pl: 1, pr: 1, color: 'white', background: theme.palette.success.dark }}>
                    Copied!
                </Typography>
            </Popover>
        </>
    )
}

export default ShareChatbot
