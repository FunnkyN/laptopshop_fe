
import { styled } from '@mui/material/styles'

const AdminPannelWrapper = styled('div')(({ theme }) => ({
  '& .apexcharts-canvas': {
    "& line[stroke='transparent']": {
      display: 'none'
    },
    '& .apexcharts-xaxis > line, & .apexcharts-yaxis > line': {
      stroke: theme.palette.divider
    },
    '& .apexcharts-xaxis-tick, & .apexcharts-yaxis-tick': {
      stroke: theme.palette.divider
    },
    '& .apexcharts-tooltip': {
      boxShadow: theme.shadows[3],
      borderColor: theme.palette.divider,
      background: theme.palette.background.paper,
      '& .apexcharts-tooltip-title': {
        fontWeight: 600,
        borderColor: theme.palette.divider,
        background: theme.palette.background.paper
      },
      '&.apexcharts-theme-dark': {
        '& .apexcharts-tooltip-text-label, & .apexcharts-tooltip-text-value': {
          color: theme.palette.common.white
        }
      },
      '& .bar-chart': {
        padding: theme.spacing(2, 2.5)
      }
    },
    '& .apexcharts-xaxistooltip': {
      borderColor: theme.palette.divider,
      background: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.background.default,
      '& .apexcharts-xaxistooltip-text': {
        color: theme.palette.text.primary
      },
      '&:after': {
        borderBottomColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.background.default
      },
      '&:before': {
        borderBottomColor: theme.palette.divider
      }
    },
    '& .apexcharts-yaxistooltip': {
      borderColor: theme.palette.divider,
      background: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.background.default,
      '& .apexcharts-yaxistooltip-text': {
        color: theme.palette.text.primary
      },
      '&:after': {
        borderLeftColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.background.default
      },
      '&:before': {
        borderLeftColor: theme.palette.divider
      }
    },
    '& .apexcharts-text, & .apexcharts-tooltip-text, & .apexcharts-datalabel-label, & .apexcharts-datalabel': {
      filter: 'none',
export default AdminPannelWrapper

