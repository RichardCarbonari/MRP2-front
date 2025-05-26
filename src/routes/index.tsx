import type { AppRoutes } from '../types/routes';
import Layout from '../components/Layout';
import Home from '../pages/Home/index';
import Employee from '../pages/Employee/index';
import Planning from '../pages/Planning/index';
import Admin from '../pages/Admin/index';
import Financial from '../pages/Financial/index';
import FinancialInput from '../pages/FinancialInput/index';
import TeamDetailsPage from '../pages/TeamDetailsPage/index';
import { TimerProvider } from '../contexts/TimerContext';

export const routes: AppRoutes = [
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'funcionario',
        element: <Employee />,
      },
      {
        path: 'planejamento',
        element: <Planning />,
      },
      {
        path: 'admin',
        element: (
          <TimerProvider>
            <Admin />
          </TimerProvider>
        ),
      },
      {
        path: 'financeiro',
        element: <Financial />,
      },
      {
        path: 'financeiro/entrada',
        element: <FinancialInput />,
      },
      {
        path: 'equipe/:teamId',
        element: <TeamDetailsPage />,
      },
    ],
  },
]; 