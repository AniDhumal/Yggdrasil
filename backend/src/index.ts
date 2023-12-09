import 'colorts/lib/string';
import EventMonitoring from './Events';
import { CONFIG } from './config';
import ProtocolMonitoring from './ProtocolMonitoring';

class Main {
  eventMonitor: EventMonitoring;
  protocolMonitor: ProtocolMonitoring;
  arbitrumStrategies: string[];

  constructor() {
    // * Arbitrum Monitoring
    // * ===================
    this.arbitrumStrategies = ['0x938c795358fD433aDdbd1374eCe2aD69D61a31F2'];
    this.eventMonitor = new EventMonitoring(CONFIG.CHAIN_NAME_MAPPING.ARBITRUM_GOERLI, this.arbitrumStrategies);

    // * Protocol Monitoring
    // * ===================
    // -> Monitors the dapps for best option to invest
    this.protocolMonitor = new ProtocolMonitoring();
  }

  run = () => {
    this._consoleLog('Main engine started');
    this.eventMonitor.startMonitor();
    this.protocolMonitor.startMonitor();
  };

  _consoleLog = (s: any) => {
    console.log('>>>> [Main] :'.bgCyan);
    console.log(s);
  };

  _consoleError = (s: any) => {
    console.log('>>>> [Main] :'.bgCyan);
    console.log(s);
  };
}

if (require.main === module) {
  const main = new Main();
  main.run();
}
