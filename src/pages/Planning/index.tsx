import React, { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Tab,
    Tabs
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TimelineIcon from '@mui/icons-material/Timeline';
import ProductionCalendar from '../../components/ProductionCalendar';
import DemandForecast from '../../components/DemandForecast';
import GanttChart from '../../components/GanttChart';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// Dados de exemplo para o GanttChart
const sampleTasks = [
    {
        id: '1',
        name: 'Produção Lote #123 - Peça A',
        startDate: new Date(2024, 2, 1),
        endDate: new Date(2024, 2, 5),
        progress: 100
    },
    {
        id: '2',
        name: 'Produção Lote #124 - Peça B',
        startDate: new Date(2024, 2, 3),
        endDate: new Date(2024, 2, 8),
        progress: 70
    },
    {
        id: '3',
        name: 'Manutenção Preventiva - Máquina 01',
        startDate: new Date(2024, 2, 6),
        endDate: new Date(2024, 2, 7),
        progress: 0
    },
    {
        id: '4',
        name: 'Produção Lote #125 - Peça C',
        startDate: new Date(2024, 2, 8),
        endDate: new Date(2024, 2, 12),
        progress: 30
    }
];

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`planning-tabpanel-${index}`}
            aria-labelledby={`planning-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function Planning() {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Container 
            maxWidth="lg" 
            sx={{ 
                minWidth: '800px',
                maxWidth: '1024px !important',
                margin: '0 auto',
                padding: '24px'
            }}
        >
            <Paper 
                elevation={0}
                sx={{ 
                    p: 2, 
                    mb: 3, 
                    backgroundColor: '#1DB954',
                    color: 'white',
                    borderRadius: 2,
                    textAlign: 'center'
                }}
            >
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                    Planejamento da Produção
                </Typography>
            </Paper>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTab-root': {
                            minHeight: '64px'
                        },
                        '& .Mui-selected': {
                            color: '#1DB954 !important'
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#1DB954'
                        }
                    }}
                >
                    <Tab 
                        icon={<CalendarMonthIcon />} 
                        label="Calendário" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<QueryStatsIcon />} 
                        label="Previsão de Demanda" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<TimelineIcon />} 
                        label="Cronograma" 
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            <TabPanel value={currentTab} index={0}>
                <ProductionCalendar />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
                <DemandForecast />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
                <GanttChart tasks={sampleTasks} />
            </TabPanel>
        </Container>
    );
} 