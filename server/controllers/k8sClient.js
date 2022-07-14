// k8s DASHBOARD
// import express from "express";
// K8s API
// convert controllers to promise chaining

// DO NOT DELETE: http://127.0.0.1:9090/api/v1/labels
const k8s = require('@kubernetes/client-node');

//New instance of k8s, (Kube config are the files that connect )
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApiSvc = kc.makeApiClient(k8s.CoreV1Api); // Queries services
const k8sApiDepl = kc.makeApiClient(k8s.AppsV1Api); // Queries deployments
//const metricsClient = new k8s.Metrics(kc);

k8sController = {};

// // example from official github repo
// k8sApiSvc.listNamespacedPod('default').then((res) => {
//   console.log(res.body);
// });

// Getting pod count and pod names
k8sController.getAllPods = async (req, res, next) => {
  try {
    const podsResult = await k8sApiSvc.listPodForAllNamespaces();
    res.locals.podCount = podsResult.body.items;

    const podNames = [];
    const podIps = [];
    podsResult.body.items.forEach((element) => {
      podNames.push(element.metadata.generateName);
      podIps.push(element.status.podIP);
    });
    res.locals.podNames = podNames;
    res.locals.podIps = podIps;
    return next();
  } catch (err) {
    return next({
      log: 'Error getting data from getAllPods',
      status: 404,
      message: {
        err: 'An error happened trying to get the data from getAllPods',
      },
    });
  }
};

// Getting list of nodes and list of component statuses
k8sController.getAllNodes = async (req, res, next) => {
  const { name } = req.params;
  try {
    const nodeResult = await k8sApiSvc.listNode(name);
    res.locals.nodeList = nodeResult.response.body.items;
    // const nodeStatus = await k8sApiSvc.listComponentStatus();
    // res.locals.nodeList.nodeStatus = nodeStatus.body;
    return next();
  } catch (err) {
    return next({
      log: 'Error getting data from getAllNodes',
      status: 404,
      message: {
        err: 'An error happened trying to get All Nodes',
      },
    });
  }
};

// Getting number of namespaces and their names
k8sController.getAllNamespaces = async (req, res, next) => {
  try {
    const namespaceResult = await k8sApiSvc.listNamespace();
    res.locals.namespace = namespaceResult.response.body.items;
    const namespaceNames = [];
    namespaceResult.response.body.items.forEach((element) => {
      namespaceNames.push(element.metadata.name);
    });
    res.locals.namespaceNames = namespaceNames;
    return next();
  } catch (err) {
    return next({
      log: 'Error getting data from getAllNamespaces',
      status: 404,
      message: {
        err: 'An error happened trying to get the data from getAllNamespaces',
      },
    });
  }
};

// Getting all deployments in cluster
k8sController.getDeployment = async (req, res, next) => {
  try {
    const getDeployment = await k8sApiDepl.listDeploymentForAllNamespaces();
    res.locals.deployment = getDeployment.body.items;
    return next();
  } catch (err) {
    return next({
      log: 'Error getting data from getDeploymentList',
      status: 404,
      message: {
        err: 'An error happened trying to get the data from getDeploymentList',
      },
    });
  }
};

// Getting all services in cluster
k8sController.getService = async (req, res, next) => {
  try {
    const getService = await k8sApiSvc.listServiceForAllNamespaces();
    res.locals.service = getService.body.items;
    console.log('SERVICE COUNT:', getService.body.items);
    return next();
  } catch (err) {
    return next({
      log: 'Error getting data from getServiceList',
      status: 404,
      message: {
        err: 'An error happened trying to get the data from getServiceList',
      },
    });
  }
};

module.exports = k8sController;
