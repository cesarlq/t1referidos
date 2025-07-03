import React from 'react';
import { createTheme } from '@mui/material/styles';
import { toggleButtonClasses } from '@mui/material';
import { statusColors } from '../util/staticData';
import type { } from '@mui/lab/themeAugmentation';
import CheckboxIcon from '../assets/icons/CheckboxIcon';
import UnCheckboxIcon from '../assets/icons/UnCheckboxIcon';
import IndeterminateCheckboxIcon from '../assets/icons/IndeterminateCheckboxIcon';
import UnCheckRadioIcon from '../assets/icons/UnCheckRadio';
import CheckRadio from '../assets/icons/CheckRadio';
import ChevronDown from '../assets/svg-icons/chevron-down-icon';


const manrope = {
  style: {
    fontFamily: '"Manrope", sans-serif'
  }
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#db3b2b'
    },
    secondary: {
      main: '#fadede'
    },
    error: {
      main: '#FF0000'
    }
  },
  typography: {
    fontFamily: manrope.style.fontFamily,
    fontSize: 13
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          // '&.Mui-focused': { // This seems to be a typo, Mui-focused is usually on the root
          //   borderColor: '#E7E7E7 !important',
          //   borderWidth: '1px !important',
          // }
        },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E7E7E7 !important',
            // borderWidth: '1px !important', // Standard practice is to not change border width on hover to prevent layout shifts
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E7E7E7 !important',
            borderWidth: '1px !important',
          }
        }
      }
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            borderRadius: '10px',
            fontWeight: '700',
            fontSize:'12px',
            lineHeight:'100%',
            letterSpacing:'0%',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: '#a30000'
            },
            ':disabled': {
              backgroundColor: '#F1B0A9',
              color: 'white',
              opacity: 1,
              boxShadow: 'none'
            }
          }
        },
        {
          props: { variant: 'outlined' },
          style: {
            borderRadius: '10px',
            border: '1px solid #E7E7E7',
            fontWeight: '500',
            fontSize:'12px',
            color: '#4c4c4c',
            boxShadow: 'none',
            '&:hover': {
              border: 'solid 1px #E7E7E7',
              boxShadow: 'none',
              backgroundColor: '#E7E7E7'
            }
          }
        },
        {
          props: { variant: 'text' },
          style: {
            color: '#4c4c4c',
            fontWeight: '600',
            '&:hover': {
              // border: 'none', // Text buttons don't typically have a border
              backgroundColor: 'transparent'
            }
          }
        }
      ],
      defaultProps: {
        variant: 'contained'
      },
      styleOverrides: {
        root: {
          boxShadow: 'none!important',
          textTransform: 'none',
          fontSize: 12,
          height: 35
        },
        colorInherit: { // This might be an unexpected override. Typically color="inherit" means it inherits color from its parent.
          // backgroundColor: 'white'
        }
      }
    },
    MuiLoadingButton: { // Ensure @mui/lab is installed for MuiLoadingButton
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            border: 'none', // Outlined LoadingButton without a border might look like a text button
            boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.14)',
            fontWeight: 'normal'
          }
        },
        {
          props: { variant: 'text' },
          style: {
            fontWeight: '600'
          }
        }
      ],
      defaultProps: {
        variant: 'contained'
      },
      styleOverrides: {
        root: {
          borderRadius: 9,
          textTransform: 'none',
          fontSize: 12,
          boxShadow: 'none',
          height: 35
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '10px!important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E7E7E7'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E7E7E7' // Consider a different hover color for feedback, or remove if same as default
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #E7E7E7' // Repetitive with MuiOutlinedInput, can be consolidated
          },
          // These seem redundant given the overrides on MuiOutlinedInput and MuiTextField
          // '&:focus-within fieldset, &:focus-visible fieldset': {
          //   border: '1px solid #E7E7E7 !important'
          // },
          // '&:hover fieldset': {
          //   border: '1px solid #E7E7E7 !important',
          // },
        },
        input: {
          fontWeight: 300,
          fontSize: 12,
          color: '#4c4c4c',
          height: 18 // MUI input height is managed by padding and line-height as well
        }
      },
      defaultProps: {
        onWheel: (event: any) => { // Consider if this is truly desired for all InputBase components
            if (event.target instanceof HTMLElement) {
                event.target.blur();
            }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // borderRadius: 12 // MuiInputBase already sets borderRadius, this might conflict or be redundant
        }
      },
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        InputLabelProps: {
          sx: {
            '&.MuiInputLabel-shrink ': { // The space might be a typo
              color: '#898989'
            }
          }
        },
        InputProps: { // These styles are very similar to MuiOutlinedInput and MuiInputBase, potential for consolidation
          sx: {
            // '&.Mui-focused fieldset': { // Already handled by MuiOutlinedInput
            //   border: '1px solid #E7E7E7!important'
            // },
            borderRadius: '10px', // Consistent with MuiInputBase
            // '&:hover fieldset': { // Already handled by MuiOutlinedInput
            //   border: '1px solid #E7E7E7 !important'
            // },
            // '&:focus-within fieldset, &:focus-visible fieldset': { // Already handled by MuiOutlinedInput
            //   border: '1px solid #E7E7E7 !important'
            // }
          }
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          '&.MuiLinearProgress-colorPrimary': { // This is the default, usually you'd override specific color props
            backgroundColor: '#ededed'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 'bold'
        },
        colorSuccess: {
          ...statusColors['success']
        },
        colorError: {
          ...statusColors['error']
        },
        colorInfo: {
          ...statusColors['info']
        },
        colorWarning: {
          ...statusColors['warning']
        },
        colorPrimary: { // Overriding MUI's primary chip color
          ...statusColors['primary']
        },
        colorSecondary: { // Overriding MUI's secondary chip color
          ...statusColors['secondary']
        }
      },
      variants: [
        {
          props: {
            color: 'default',
            variant: 'filled' // Default variant for Chip is filled
          },
          style: {
            ...statusColors['default']
          }
        }
      ]
    },
    MuiSkeleton: {
      defaultProps: {
        variant: 'rounded',
        animation: 'wave'
      },
      styleOverrides: {
        root: {
          // bgcolor: 'grey.100', // MUI theme has a palette.grey object, e.g. theme.palette.grey[100]
          borderRadius: '7px'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        // These target specific severity + variant combinations.
        // Consider if you want to style all filled alerts, e.g. MuiAlert-filled
        filledSuccess: { // e.g. <Alert severity="success" variant="filled">
          borderRadius: '7px'
        },
        filledError: { // e.g. <Alert severity="error" variant="filled">
          borderRadius: '7px'
        }
      }
    },
    MuiAutocomplete: { // Ensure @mui/lab is installed
      styleOverrides: {
        inputRoot: { // This targets the TextField's InputRoot used within Autocomplete
          // '& .MuiInputLabel-root': { // This should target the label within the inputRoot
          //   color: 'gray' // Be specific, e.g. theme.palette.grey[500]
          // }
        }
      },
      defaultProps: {
        popupIcon: React.createElement(ChevronDown, { width: 16, height: 16 })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '7px' // This will affect many components: Dialog, Popover, Card, Menu, etc.
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'white', // Consider using theme.palette.background.paper
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 13px',
          fontWeight: 500,
          borderRadius: 7, // Consistent with MuiPaper, MuiSkeleton, etc.
          color: '#db3b2b', // theme.palette.primary.main
          [`&.${toggleButtonClasses.selected}`]: {
            backgroundColor: '#fadede', // theme.palette.secondary.main
            color: '#db3b2b', // theme.palette.primary.main
            '&:hover': {
              backgroundColor: '#fadede' // theme.palette.secondary.main
            }
          },
          '&:hover': {
            backgroundColor: 'transparent' // Or a very light grey for feedback
          }
        }
      }
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.14)', // Consider using theme.shadows
          width: 'max-content',
          borderRadius: 7
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiPagination: { // Ensure @mui/material or @mui/lab is installed
      defaultProps: {
        shape: 'rounded'
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 35,
          height: 20,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff', // theme.palette.common.white
              '& + .MuiSwitch-track': {
                opacity: 1,
                border: 0,
                backgroundColor: '#51AF70' // A custom green, consider adding to palette if used elsewhere
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5
              }
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#33cf4d', // Another custom green
              border: '6px solid #fff'
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: 'white' // Or theme.palette.grey[100] for a disabled look
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.3 // MUI uses theme.palette.action.disabledOpacity
            }
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 16,
            height: 16
          },
          '& .MuiSwitch-track': {
            borderRadius: 13, // Or height / 2 for a perfectly round track
            backgroundColor: '#E9E9EA', // theme.palette.grey[300] or similar
            opacity: 1
          }
        }
      }
    },
    MuiCheckbox: {
      defaultProps: {
        checkedIcon: React.createElement(CheckboxIcon),
        icon: React.createElement(UnCheckboxIcon),
        indeterminateIcon: React.createElement(IndeterminateCheckboxIcon),
      },
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '&.Mui-disabled': {
            '& svg': {
              // borderRadius: 3, // SVG elements don't have border-radius
              '& g': { // This is very specific to the internal structure of your SVG
                '& path': {
                  fill: '#f3f3f3',
                  // color: '#C3C3C3', // SVG paths use 'fill' or 'stroke' for color
                  // backgroundColor: '#f3f3f3', // Not applicable to path
                  stroke: '#d3d3d3',
                },
                '& rect': { // Also specific to your SVG structure
                  fill: '#f3f3f3',
                },
              },
            },
          },
          '&:hover:not(.Mui-checked):not(.Mui-disabled)': {
            backgroundColor: 'transparent',
            '& svg': {
              '& path': { // Again, specific to SVG structure
                fill: '#f8f8f8', // A very light fill for hover
              },
            },
          },
        },
      },
    },
    MuiSelect: { // MuiSelect uses MuiInputBase and MuiOutlinedInput internally
      styleOverrides: {
        select: { // Targets the select display area
          fontSize: '12px',
          color: '#4c4c4c',
          height: 19, // This might be too restrictive, padding and line-height are better for controlling height
          display: 'flex',
          alignItems: 'center',
          // fontsize: 12 // Duplicate of fontSize
        },
        root: { // Targets the root of the MuiOutlinedInput component used by Select
          // fontsize: 12, // Should be fontSize
          border: '0.5px solid #EBEBEB', // This will override the notchedOutline of MuiOutlinedInput
          borderRadius: '12px',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '0.5px solid #EBEBEB', // This might conflict with MuiOutlinedInput's focused style
            // borderRadius: '12px' // Already set on root
          },
          '&:hover .MuiOutlinedInput-notchedOutline': { // Added .MuiOutlinedInput-notchedOutline here
             border: '0.5px solid #EBEBEB !important', // Important needed to override MuiOutlinedInput hover
             // borderRadius: '12px' // Already set on root
          },
          // Note: The default MuiSelect uses an MuiInputBase, which then uses an MuiOutlinedInput by default.
          // Overriding border directly on the root of MuiSelect might fight with the MuiOutlinedInput's notchedOutline.
          // It's often better to customize via InputProps={{ sx: { ... } }} on the Select component
          // or by styling MuiOutlinedInput directly if these styles should apply to all outlined inputs.
        }
      },
      defaultProps: {
        IconComponent: (props: React.SVGProps<SVGSVGElement>) => React.createElement("span", {...props, style: {display: 'flex', alignItems: 'center'}}, React.createElement(ChevronDown, { width: 16, height: 16 }))
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: 13 // This sets a default font size for all Typography components
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '12px'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f5f5f5' // Consider using theme.palette.action.hover
          }
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '13px',
          fontWeight: 400,
          color: '#4c4c4c' // theme.palette.text.primary or secondary
        }
      }
    },
    MuiRadio: {
      defaultProps: {
        icon: React.createElement(UnCheckRadioIcon),
        checkedIcon: React.createElement(CheckRadio)
      },
      styleOverrides: {
        root: {
          "&.Mui-disabled": { // Similar to Checkbox, this is very SVG-specific
            "& svg": {
              "& g": {
                "& path": {
                  fill: "#f3f3f3",
                },
                "& rect": { // If your radio SVG doesn't have rects, this won't apply
                  fill: "#f3f3f3"
                }
              }
            }
          }
        }
      }
    }
  }
});

export default theme;
