import { useState, useEffect, Fragment } from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import axios from 'axios'

import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete'
import { Popper, CircularProgress, TextField, Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { baseURL } from 'store/constant'

const StyledPopper = styled(Popper)({
    boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)',
    borderRadius: '10px',
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 10,
            margin: 10
        }
    }
})

const fetchList = async ({ name, nodeData }) => {
    const loadMethod = nodeData.inputParams.find((param) => param.name === name)?.loadMethod
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    let lists = await axios
        .post(
            `${baseURL}/api/v1/node-load-method/${nodeData.name}`,
            { ...nodeData, loadMethod },
            { auth: username && password ? { username, password } : undefined }
        )
        .then(async function (response) {
            return response.data
        })
        .catch(function (error) {
            console.error(error)
        })
    return lists
}

export const AsyncDropdown = ({
    name,
    nodeData,
    value,
    onSelect,
    isCreateNewOption,
    onCreateNew,
    disabled = false,
    disableClearable = false
}) => {
    const customization = useSelector((state) => state.customization)

    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const findMatchingOptions = (options = [], value) => options.find((option) => option.name === value)
    const getDefaultOptionValue = () => ''
    const addNewOption = [{ label: '- 新建 -', name: '-create-' }]
    let [internalValue, setInternalValue] = useState(value ?? 'choose an option')

    useEffect(() => {
        setLoading(true)
        ;(async () => {
            const fetchData = async () => {
                let response = await fetchList({ name, nodeData })
                if (isCreateNewOption) setOptions([...response, ...addNewOption])
                else setOptions([...response])
                setLoading(false)
            }
            fetchData()
        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Autocomplete
                id={name}
                disabled={disabled}
                disableClearable={disableClearable}
                size='small'
                sx={{ width: '100%' }}
                open={open}
                onOpen={() => {
                    setOpen(true)
                }}
                onClose={() => {
                    setOpen(false)
                }}
                options={options}
                value={findMatchingOptions(options, internalValue) || getDefaultOptionValue()}
                onChange={(e, selection) => {
                    const value = selection ? selection.name : ''
                    if (isCreateNewOption && value === '-create-') {
                        onCreateNew()
                    } else {
                        setInternalValue(value)
                        onSelect(value)
                    }
                }}
                PopperComponent={StyledPopper}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        value={internalValue}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </Fragment>
                            )
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <Box component='li' {...props}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='h5'>{option.label}</Typography>
                            {option.description && (
                                <Typography sx={{ color: customization.isDarkMode ? '#9e9e9e' : '' }}>{option.description}</Typography>
                            )}
                        </div>
                    </Box>
                )}
            />
        </>
    )
}

AsyncDropdown.propTypes = {
    name: PropTypes.string,
    nodeData: PropTypes.object,
    value: PropTypes.string,
    onSelect: PropTypes.func,
    onCreateNew: PropTypes.func,
    disabled: PropTypes.bool,
    disableClearable: PropTypes.bool,
    isCreateNewOption: PropTypes.bool
}
