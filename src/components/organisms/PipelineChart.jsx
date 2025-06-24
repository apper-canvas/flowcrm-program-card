import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ProgressRing from '@/components/atoms/ProgressRing';

const PipelineChart = ({ deals = [] }) => {
  const stages = ['Discovery', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const stageColors = {
    'Discovery': '#94a3b8',
    'Qualified': '#4FC3F7',
    'Proposal': '#7B68EE',
    'Negotiation': '#5B4FCF',
    'Closed Won': '#4CAF50',
    'Closed Lost': '#F44336'
  };

  const stageData = stages.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage);
    const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    return {
      stage,
      count: stageDeals.length,
      value: stageValue,
      color: stageColors[stage]
    };
  });

  const totalValue = stageData.reduce((sum, stage) => sum + stage.value, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pipeline Overview</h3>
        <div className="text-sm text-gray-500">
          Total: ${(totalValue / 1000).toFixed(0)}K
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stageData.map((stage, index) => (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <ProgressRing
              progress={totalValue > 0 ? (stage.value / totalValue) * 100 : 0}
              color={stage.color}
              size={80}
              strokeWidth={8}
              showText={false}
              className="mx-auto mb-3"
            />
            <h4 className="font-medium text-gray-900 text-sm mb-1">{stage.stage}</h4>
            <p className="text-xs text-gray-500">{stage.count} deals</p>
            <p className="text-xs font-medium text-gray-700">
              ${(stage.value / 1000).toFixed(0)}K
            </p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default PipelineChart;