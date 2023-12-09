import 'colorts/lib/string';
import EventMonitoring from './Events';
import { CONFIG } from './config';
import ProtocolMonitoring from './ProtocolMonitoring';

class Main {
  eventMonitor: EventMonitoring;
  protocolMonitor: ProtocolMonitoring;

  constructor() {
    this.eventMonitor = new EventMonitoring(CONFIG.CHAIN_NAME_MAPPING.ETHEREUM_GOERLI, ['0xdac17f958d2ee523a2206206994597c13d831ec7']);
    this.protocolMonitor = new ProtocolMonitoring();
  }

  run = () => {
    this._consoleLog('Main engine started');
    this.eventMonitor.startMonitor();
    this.protocolMonitor.startMonitor();
  };

  _consoleLog = (s: any) => {
    console.log('>>>> [Main] :'.blue);
    console.log(s);
  };

  _consoleError = (s: any) => {
    console.log('>>>> [Main] :'.red);
    console.log(s);
  };
}

if (require.main === module) {
  const main = new Main();
  main.run();
}
